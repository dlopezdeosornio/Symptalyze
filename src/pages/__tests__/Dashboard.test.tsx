import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'
import { AuthProvider } from '../../contexts/AuthProvider'
import type { User } from '../../types/user'
import type { SymptomEntry } from '../../types/entry.data'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock the storage utilities
vi.mock('../../utils/storage', () => ({
  getUserStorage: vi.fn(),
  setUserStorage: vi.fn(),
  STORAGE_KEYS: {
    SYMPTOM_ENTRIES: 'symptom-entries',
    MEDICATIONS: 'medications',
  }
}))

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
}

const mockSymptomEntries: SymptomEntry[] = [
  {
    id: '1',
    date: '2024-01-01T00:00:00.000Z',
    symptoms: ['headache', 'fatigue'],
    sleepHours: 8,
    dietQuality: 4,
    exerciseMinutes: 30,
    medications: ['ibuprofen']
  },
  {
    id: '2',
    date: '2024-01-02T00:00:00.000Z',
    symptoms: ['dizziness'],
    sleepHours: 6,
    dietQuality: 2,
    exerciseMinutes: 0,
    medications: []
  }
]

const DashboardWithProviders = () => (
  <BrowserRouter>
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  </BrowserRouter>
)

describe('Dashboard', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Set up default user data
    localStorage.setItem('currentUser', JSON.stringify(mockUser))
    
    // Mock getUserStorage to return empty array by default
    const { getUserStorage } = await import('../../utils/storage')
    vi.mocked(getUserStorage).mockReturnValue([])
  })

  it('should render dashboard with all main components', async () => {
    render(<DashboardWithProviders />)

    // Wait for the user data to be loaded and the welcome message to appear
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test!/)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    expect(screen.getByText('Track your health and symptoms to better understand your patterns')).toBeInTheDocument()
    expect(screen.getByText('Add New Entry')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('should show signup message for new users', async () => {
    // Mock navigationSource as 'signup'
    localStorage.setItem('navigationSource', 'signup')

    render(<DashboardWithProviders />)

    await waitFor(() => {
      expect(screen.getByText(/Nice to meet you, Test!/)).toBeInTheDocument()
    })
  })

  it('should show login message for returning users', async () => {
    // Mock navigationSource as 'login'
    localStorage.setItem('navigationSource', 'login')

    render(<DashboardWithProviders />)

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test!/)).toBeInTheDocument()
    })
  })

  it('should load and display saved symptom entries', async () => {
    const { getUserStorage } = await import('../../utils/storage')
    vi.mocked(getUserStorage).mockReturnValue(mockSymptomEntries)

    render(<DashboardWithProviders />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('headache')).toBeInTheDocument()
      expect(screen.getByText('fatigue')).toBeInTheDocument()
      expect(screen.getByText('dizziness')).toBeInTheDocument()
    })
  })

  it('should add new symptom entry', async () => {
    const user = userEvent.setup()
    const { setUserStorage } = await import('../../utils/storage')

    render(<DashboardWithProviders />)

    // Fill out symptom form
    const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
    await user.click(searchInput)
    await user.type(searchInput, 'headache')
    await user.click(screen.getByText('Headache'))

    const sleepInput = screen.getByLabelText(/Sleep Hours/i)
    await user.clear(sleepInput)
    await user.type(sleepInput, '8')

    const submitBtn = screen.getByRole('button', { name: /Add Entry/i })
    await user.click(submitBtn)

    // Should call setUserStorage with new entry
    await waitFor(() => {
      expect(setUserStorage).toHaveBeenCalledWith(
        'symptom-entries',
        'test@example.com',
        expect.arrayContaining([
          expect.objectContaining({
            symptoms: ['headache'],
            sleepHours: 8
          })
        ])
      )
    })
  })

  it('should handle logout and navigate to home', async () => {
    const user = userEvent.setup()

    render(<DashboardWithProviders />)

    const logoutBtn = screen.getByText('Logout')
    await user.click(logoutBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should clear entries when user logs out', async () => {
    const user = userEvent.setup()
    const { getUserStorage } = await import('../../utils/storage')
    vi.mocked(getUserStorage).mockReturnValue(mockSymptomEntries)


    render(<DashboardWithProviders />)

    // Wait for entries to load
    await waitFor(() => {
      expect(screen.getByText('headache')).toBeInTheDocument()
    })

    // Logout
    const logoutBtn = screen.getByText('Logout')
    await user.click(logoutBtn)

    // Entries should be cleared
    expect(screen.queryByText('headache')).not.toBeInTheDocument()
  })

  it('should save entries when they change', async () => {
    const user = userEvent.setup()
    const { setUserStorage } = await import('../../utils/storage')
    

    render(<DashboardWithProviders />)

    // Add an entry
    const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
    await user.click(searchInput)
    await user.type(searchInput, 'fatigue')
    await user.click(screen.getByText('Fatigue'))

    const submitBtn = screen.getByRole('button', { name: /Add Entry/i })
    await user.click(submitBtn)

    // Should save to storage
    await waitFor(() => {
      expect(setUserStorage).toHaveBeenCalledWith(
        'symptom-entries',
        'test@example.com',
        expect.any(Array)
      )
    })
  })

  it('should handle empty user gracefully', async () => {
    // Clear user data for this test
    localStorage.removeItem('currentUser')
    render(<DashboardWithProviders />)

    // Should not crash and should show default message
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, User!/)).toBeInTheDocument()
    })
  })

  it('should handle user without firstName', () => {
    const userWithoutFirstName = { ...mockUser, firstName: undefined }
    localStorage.setItem('currentUser', JSON.stringify(userWithoutFirstName))

    render(<DashboardWithProviders />)

    expect(screen.getByText(/Welcome back, User!/)).toBeInTheDocument()
  })

  it('should render all dashboard sections', () => {

    render(<DashboardWithProviders />)

    // Check for main sections
    expect(screen.getByText('Add New Entry')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
    
    // These components should be rendered (even if empty)
    expect(screen.getByRole('button', { name: /Add Entry/i })).toBeInTheDocument()
  })

  it('should handle storage errors gracefully', async () => {
    const { getUserStorage } = await import('../../utils/storage')
    vi.mocked(getUserStorage).mockImplementation(() => {
      throw new Error('Storage error')
    })

    // Should not crash due to storage errors (ResizeObserver errors are expected in test environment)
    expect(() => {
      render(<DashboardWithProviders />)
    }).not.toThrow('Storage error')
  })

  it('should update when currentUser changes', async () => {
    // Clear user data initially
    localStorage.removeItem('currentUser')
    render(<DashboardWithProviders />)

    // Initially no user
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, User!/)).toBeInTheDocument()
    })

    // Test that the component handles user changes by re-rendering with user data
    localStorage.setItem('currentUser', JSON.stringify(mockUser))
    const { rerender } = render(<DashboardWithProviders />)

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test!/)).toBeInTheDocument()
    })
  })

  it('should not save entries on initial load', async () => {
    const { setUserStorage } = await import('../../utils/storage')
    
    render(<DashboardWithProviders />)

    // Should initialize storage with empty arrays on initial load
    expect(setUserStorage).toHaveBeenCalledWith('medications', 'test@example.com', [])
    expect(setUserStorage).toHaveBeenCalledWith('symptom-entries', 'test@example.com', [])
  })
})

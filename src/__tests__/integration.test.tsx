import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'
import { AuthProvider } from '../contexts/AuthProvider'

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
vi.mock('../utils/storage', () => ({
  getUserStorage: vi.fn(),
  setUserStorage: vi.fn(),
  STORAGE_KEYS: {
    SYMPTOM_ENTRIES: 'symptom-entries',
    MEDICATIONS: 'medications',
  }
}))

const AppWithProviders = () => (
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)

describe('Integration Tests - User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Complete User Registration and Login Flow', () => {
    it('should allow user to sign up and then log in', async () => {
      const user = userEvent.setup()
      const { getUserStorage, setUserStorage } = await import('../utils/storage')
      vi.mocked(getUserStorage).mockReturnValue([])

      render(<AppWithProviders />)

      // Start at auth landing
      expect(screen.getByText(/Welcome to Symptalyze/i)).toBeInTheDocument()

      // Navigate to signup
      const signupButton = screen.getByText(/Get Started/i)
      await user.click(signupButton)

      // Fill out signup form
      const firstNameInput = screen.getByLabelText(/First Name/i)
      const lastNameInput = screen.getByLabelText(/Last Name/i)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const passwordInput = screen.getByLabelText(/Password/i)
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

      await user.type(firstNameInput, 'John')
      await user.type(lastNameInput, 'Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      const signupSubmitBtn = screen.getByRole('button', { name: /Create Account/i })
      await user.click(signupSubmitBtn)

      // Should navigate to dashboard
      await waitFor(() => {
        expect(screen.getByText(/Nice to meet you, John!/)).toBeInTheDocument()
      })

      // Logout
      const logoutBtn = screen.getByText('Logout')
      await user.click(logoutBtn)

      // Should navigate back to home
      expect(mockNavigate).toHaveBeenCalledWith('/')

      // Navigate to login
      const loginButton = screen.getByText(/Sign In/i)
      await user.click(loginButton)

      // Fill out login form
      const loginEmailInput = screen.getByLabelText(/Email Address/i)
      const loginPasswordInput = screen.getByLabelText(/Password/i)

      await user.type(loginEmailInput, 'john@example.com')
      await user.type(loginPasswordInput, 'password123')

      const loginSubmitBtn = screen.getByRole('button', { name: /Sign In/i })
      await user.click(loginSubmitBtn)

      // Should navigate to dashboard
      await waitFor(() => {
        expect(screen.getByText(/Welcome back, John!/)).toBeInTheDocument()
      })
    })

    it('should prevent duplicate email registration', async () => {
      const user = userEvent.setup()

      render(<AppWithProviders />)

      // First signup
      const signupButton = screen.getByText(/Get Started/i)
      await user.click(signupButton)

      const firstNameInput = screen.getByLabelText(/First Name/i)
      const lastNameInput = screen.getByLabelText(/Last Name/i)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const passwordInput = screen.getByLabelText(/Password/i)
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

      await user.type(firstNameInput, 'John')
      await user.type(lastNameInput, 'Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      const signupSubmitBtn = screen.getByRole('button', { name: /Create Account/i })
      await user.click(signupSubmitBtn)

      await waitFor(() => {
        expect(screen.getByText(/Nice to meet you, John!/)).toBeInTheDocument()
      })

      // Logout
      const logoutBtn = screen.getByText('Logout')
      await user.click(logoutBtn)

      // Try to signup with same email
      const signupButton2 = screen.getByText(/Get Started/i)
      await user.click(signupButton2)

      const firstNameInput2 = screen.getByLabelText(/First Name/i)
      const lastNameInput2 = screen.getByLabelText(/Last Name/i)
      const emailInput2 = screen.getByLabelText(/Email Address/i)
      const passwordInput2 = screen.getByLabelText(/Password/i)
      const confirmPasswordInput2 = screen.getByLabelText(/Confirm Password/i)

      await user.type(firstNameInput2, 'Jane')
      await user.type(lastNameInput2, 'Smith')
      await user.type(emailInput2, 'john@example.com') // Same email
      await user.type(passwordInput2, 'password456')
      await user.type(confirmPasswordInput2, 'password456')

      const signupSubmitBtn2 = screen.getByRole('button', { name: /Create Account/i })
      await user.click(signupSubmitBtn2)

      // Should show error
      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument()
      })
    })
  })

  describe('Symptom Tracking Flow', () => {
    it('should allow user to add and view symptom entries', async () => {
      const user = userEvent.setup()
      const { getUserStorage, setUserStorage } = await import('../utils/storage')
      vi.mocked(getUserStorage).mockReturnValue([])

      // Start with logged in user
      localStorage.setItem('currentUser', JSON.stringify({
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }))

      render(<AppWithProviders />)

      // Should be on dashboard
      expect(screen.getByText(/Welcome back, Test!/)).toBeInTheDocument()

      // Add a symptom entry
      const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
      await user.click(searchInput)
      await user.type(searchInput, 'headache')
      await user.click(screen.getByText('Headache'))

      const sleepInput = screen.getByLabelText(/Sleep Hours/i)
      await user.clear(sleepInput)
      await user.type(sleepInput, '7')

      const exerciseInput = screen.getByLabelText(/Exercise Minutes/i)
      await user.clear(exerciseInput)
      await user.type(exerciseInput, '45')

      const medicationsInput = screen.getByLabelText(/Medications/i)
      await user.type(medicationsInput, 'ibuprofen, vitamin D')

      const submitBtn = screen.getByRole('button', { name: /Add Entry/i })
      await user.click(submitBtn)

      // Should save to storage
      await waitFor(() => {
        expect(setUserStorage).toHaveBeenCalledWith(
          'symptom-entries',
          'test@example.com',
          expect.arrayContaining([
            expect.objectContaining({
              symptoms: ['headache'],
              sleepHours: 7,
              exerciseMinutes: 45,
              medications: ['ibuprofen', 'vitamin D']
            })
          ])
        )
      })

      // Form should be reset
      expect(searchInput).toHaveValue('')
      expect(sleepInput).toHaveValue('8')
      expect(exerciseInput).toHaveValue('0')
      expect(medicationsInput).toHaveValue('')
    })

    it('should load and display existing symptom entries', async () => {
      const { getUserStorage } = await import('../utils/storage')
      const mockEntries = [
        {
          id: '1',
          date: '2024-01-01T00:00:00.000Z',
          symptoms: ['headache', 'fatigue'],
          sleepHours: 8,
          dietQuality: 4,
          exerciseMinutes: 30,
          medications: ['ibuprofen']
        }
      ]
      vi.mocked(getUserStorage).mockReturnValue(mockEntries)

      localStorage.setItem('currentUser', JSON.stringify({
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }))

      render(<AppWithProviders />)

      // Should load existing entries
      await waitFor(() => {
        expect(screen.getByText('headache')).toBeInTheDocument()
        expect(screen.getByText('fatigue')).toBeInTheDocument()
      })
    })
  })

  describe('Navigation Flow', () => {
    it('should navigate between all pages correctly', async () => {
      const user = userEvent.setup()

      render(<AppWithProviders />)

      // Start at home
      expect(screen.getByText(/Welcome to Symptalyze/i)).toBeInTheDocument()

      // Navigate to signup
      const signupButton = screen.getByText(/Get Started/i)
      await user.click(signupButton)
      expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument()

      // Navigate to login
      const loginLink = screen.getByText(/Sign in here/i)
      await user.click(loginLink)
      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument()

      // Navigate back to home
      const backButton = screen.getByText(/Back to home/i)
      await user.click(backButton)
      expect(screen.getByText(/Welcome to Symptalyze/i)).toBeInTheDocument()
    })

    it('should protect dashboard route when not logged in', async () => {
      render(<AppWithProviders />)

      // Try to access dashboard without being logged in
      // This should redirect to home
      expect(screen.getByText(/Welcome to Symptalyze/i)).toBeInTheDocument()
    })
  })

  describe('Data Persistence Flow', () => {
    it('should persist user data across sessions', async () => {
      const { getUserStorage, setUserStorage } = await import('../utils/storage')
      
      // Simulate existing user data
      const existingUser = {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      }
      
      const existingEntries = [
        {
          id: '1',
          date: '2024-01-01T00:00:00.000Z',
          symptoms: ['headache'],
          sleepHours: 8,
          dietQuality: 4,
          exerciseMinutes: 30,
          medications: ['ibuprofen']
        }
      ]

      localStorage.setItem('currentUser', JSON.stringify(existingUser))
      vi.mocked(getUserStorage).mockReturnValue(existingEntries)

      render(<AppWithProviders />)

      // Should load existing data
      await waitFor(() => {
        expect(screen.getByText(/Welcome back, Test!/)).toBeInTheDocument()
        expect(screen.getByText('headache')).toBeInTheDocument()
      })

      // Add new entry
      const user = userEvent.setup()
      const searchInput = screen.getByPlaceholderText(/Search symptoms/i)
      await user.click(searchInput)
      await user.type(searchInput, 'fatigue')
      await user.click(screen.getByText('Fatigue'))

      const submitBtn = screen.getByRole('button', { name: /Add Entry/i })
      await user.click(submitBtn)

      // Should save updated data
      await waitFor(() => {
        expect(setUserStorage).toHaveBeenCalledWith(
          'symptom-entries',
          'test@example.com',
          expect.arrayContaining([
            expect.objectContaining({ symptoms: ['headache'] }),
            expect.objectContaining({ symptoms: ['fatigue'] })
          ])
        )
      })
    })
  })
})

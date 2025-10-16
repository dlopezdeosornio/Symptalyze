import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthProvider'
import { useAuth } from '../hooks/useAuth'
import AuthLanding from '../pages/AuthLanding'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'

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

// Test App component that uses MemoryRouter instead of BrowserRouter
const TestApp = ({ initialEntries = ['/'] }: { initialEntries?: string[] } = {}) => {
  const { currentUser } = useAuth()
  
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<AuthLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </MemoryRouter>
  )
}

const AppWithProviders = ({ initialEntries = ['/'] }: { initialEntries?: string[] } = {}) => (
  <AuthProvider>
    <TestApp initialEntries={initialEntries} />
  </AuthProvider>
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
      expect(screen.getByText(/Symptalyze/i)).toBeInTheDocument()

      // Navigate to signup
      const signupButton = screen.getByText(/Sign Up/i)
      await user.click(signupButton)

      // Fill out signup form
      const firstNameInput = screen.getByLabelText(/First Name/i)
      const lastNameInput = screen.getByLabelText(/Last Name/i)
      const emailInput = screen.getByLabelText(/Email Address/i)
      const passwordInput = screen.getByLabelText(/^Password$/i)
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

      await user.type(firstNameInput, 'John')
      await user.type(lastNameInput, 'Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(passwordInput, 'Password123')
      await user.type(confirmPasswordInput, 'Password123')
      
      // Fill out required fields
      const genderSelect = screen.getByLabelText(/Gender/i)
      await user.selectOptions(genderSelect, 'male')
      
      const birthdayInput = screen.getByLabelText(/Date of Birth/i)
      await user.type(birthdayInput, '1990-01-01')

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
      const loginButton = screen.getByText(/Log In/i)
      await user.click(loginButton)

      // Fill out login form
      const loginEmailInput = screen.getByLabelText(/Email Address/i)
      const loginPasswordInput = screen.getByLabelText(/^Password$/i)

      await user.type(loginEmailInput, 'john@example.com')
      await user.type(loginPasswordInput, 'Password123')

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
      const signupButton = screen.getByText(/Sign Up/i)
      await user.click(signupButton)

      const firstNameInput = screen.getByLabelText(/First Name/i)
      const lastNameInput = screen.getByLabelText(/Last Name/i)
      const emailInput = screen.getByLabelText(/Email Address/i)
             const passwordInput = screen.getByLabelText(/^Password$/i)
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)

      await user.type(firstNameInput, 'John')
      await user.type(lastNameInput, 'Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(passwordInput, 'Password123')
      await user.type(confirmPasswordInput, 'Password123')
      
      // Fill out required fields
      const genderSelect = screen.getByLabelText(/Gender/i)
      await user.selectOptions(genderSelect, 'male')
      
      const birthdayInput = screen.getByLabelText(/Date of Birth/i)
      await user.type(birthdayInput, '1990-01-01')

      const signupSubmitBtn = screen.getByRole('button', { name: /Create Account/i })
      await user.click(signupSubmitBtn)

      await waitFor(() => {
        expect(screen.getByText(/Nice to meet you, John!/)).toBeInTheDocument()
      })

      // Logout
      const logoutBtn = screen.getByText('Logout')
      await user.click(logoutBtn)

      // Try to signup with same email
      const signupButton2 = screen.getByText(/Sign Up/i)
      await user.click(signupButton2)

      const firstNameInput2 = screen.getByLabelText(/First Name/i)
      const lastNameInput2 = screen.getByLabelText(/Last Name/i)
      const emailInput2 = screen.getByLabelText(/Email Address/i)
      const passwordInput2 = screen.getByLabelText(/^Password$/i)
      const confirmPasswordInput2 = screen.getByLabelText(/Confirm Password/i)

      await user.type(firstNameInput2, 'Jane')
      await user.type(lastNameInput2, 'Smith')
      await user.type(emailInput2, 'john@example.com') // Same email
      await user.type(passwordInput2, 'Password456')
      await user.type(confirmPasswordInput2, 'Password456')
      
      // Fill out required fields
      const genderSelect2 = screen.getByLabelText(/Gender/i)
      await user.selectOptions(genderSelect2, 'female')
      
      const birthdayInput2 = screen.getByLabelText(/Date of Birth/i)
      await user.type(birthdayInput2, '1992-01-01')

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

             render(<AppWithProviders initialEntries={['/dashboard']} />)

             // Should be on dashboard - wait for authentication to load
             await waitFor(() => {
               expect(screen.getByText(/Welcome back, Test!/)).toBeInTheDocument()
             }, { timeout: 5000 })

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

             render(<AppWithProviders initialEntries={['/dashboard']} />)

             // Should load existing entries - wait for authentication and data loading
             await waitFor(() => {
               expect(screen.getByText('headache')).toBeInTheDocument()
               expect(screen.getByText('fatigue')).toBeInTheDocument()
             }, { timeout: 5000 })
           })
  })

  describe('Navigation Flow', () => {
    it('should render signup page when accessed directly', async () => {
      render(<AppWithProviders initialEntries={['/signup']} />)

      // Should render signup page
      expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument()
    })

    it('should render login page when accessed directly', async () => {
      render(<AppWithProviders initialEntries={['/login']} />)

      // Should render login page
      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument()
    })

    it('should protect dashboard route when not logged in', async () => {
      render(<AppWithProviders initialEntries={['/dashboard']} />)

      // Should redirect to home when not logged in
      expect(screen.getByText(/Symptalyze/i)).toBeInTheDocument()
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

             render(<AppWithProviders initialEntries={['/dashboard']} />)

             // Should load existing data - wait for authentication and data loading
             await waitFor(() => {
               expect(screen.getByText(/Welcome back, Test!/)).toBeInTheDocument()
               expect(screen.getByText('headache')).toBeInTheDocument()
             }, { timeout: 5000 })

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

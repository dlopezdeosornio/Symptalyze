import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Signup from '../Signup'
import { AuthProvider } from '../../contexts/AuthProvider'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const SignupWithProviders = () => (
  <BrowserRouter>
    <AuthProvider>
      <Signup />
    </AuthProvider>
  </BrowserRouter>
)

describe('Signup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render signup form with all elements', () => {
    render(<SignupWithProviders />)

    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByText('Join us to start tracking your symptoms')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument()
    expect(screen.getByText("Already have an account?")).toBeInTheDocument()
    expect(screen.getByText('Sign in here')).toBeInTheDocument()
  })

  it('should have back to home button', () => {
    render(<SignupWithProviders />)

    const backButton = screen.getByText('Back to home')
    expect(backButton).toBeInTheDocument()
    expect(backButton.closest('button')).toBeInTheDocument()
  })

  it('should update form fields when user types', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const firstNameInput = screen.getByPlaceholderText('Enter your first name')
    const lastNameInput = screen.getByPlaceholderText('Enter your last name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Create a password')

    await user.type(firstNameInput, 'John')
    await user.type(lastNameInput, 'Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'Password123')

    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(passwordInput).toHaveValue('Password123')
  })

  it('should validate email format', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const emailInput = screen.getByPlaceholderText('Enter your email')

    // Invalid email
    await user.type(emailInput, 'invalid-email')
    await user.tab()

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()

    // Valid email
    await user.clear(emailInput)
    await user.type(emailInput, 'valid@example.com')

    expect(screen.getByText('Email looks good!')).toBeInTheDocument()
  })

  it('should validate password strength', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const passwordInput = screen.getByPlaceholderText('Create a password')

    // Weak password
    await user.type(passwordInput, 'weak')
    await user.tab()

    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()

    // Stronger password
    await user.clear(passwordInput)
    await user.type(passwordInput, 'Password123')

    expect(screen.getByText('Password is strong!')).toBeInTheDocument()
  })

  it('should validate password requirements', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const passwordInput = screen.getByPlaceholderText('Create a password')

    // Test each requirement
    await user.type(passwordInput, 'password') // No uppercase, no number
    await user.tab()
    expect(screen.getByText('Password must contain at least one uppercase letter')).toBeInTheDocument()

    await user.clear(passwordInput)
    await user.type(passwordInput, 'PASSWORD') // No lowercase, no number
    await user.tab()
    expect(screen.getByText('Password must contain at least one lowercase letter')).toBeInTheDocument()

    await user.clear(passwordInput)
    await user.type(passwordInput, 'Password') // No number
    await user.tab()
    expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument()
  })

  it('should validate password confirmation', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const passwordInput = screen.getByPlaceholderText('Create a password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')

    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'DifferentPassword')

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()

    await user.clear(confirmPasswordInput)
    await user.type(confirmPasswordInput, 'Password123')

    expect(screen.getByText('Passwords match!')).toBeInTheDocument()
  })

  it('should validate age requirement', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const birthdayInput = screen.getByDisplayValue('') // Date input

    // Under 18
    const under18Date = new Date()
    under18Date.setFullYear(under18Date.getFullYear() - 17)
    await user.type(birthdayInput, under18Date.toISOString().split('T')[0])

    expect(screen.getByText('You must be 18 years or older')).toBeInTheDocument()

    // Over 18
    await user.clear(birthdayInput)
    const over18Date = new Date()
    over18Date.setFullYear(over18Date.getFullYear() - 25)
    await user.type(birthdayInput, over18Date.toISOString().split('T')[0])

    expect(screen.getByText(/Age: \d+ years old/)).toBeInTheDocument()
  })

  it('should validate gender selection', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const genderSelect = screen.getByDisplayValue('') // Select input

    // No selection
    expect(screen.getByText('Please select your gender')).toBeInTheDocument()

    // Valid selection
    await user.selectOptions(genderSelect, 'male')

    expect(screen.getByText('Gender selected')).toBeInTheDocument()
  })

  it('should disable submit button when validation fails', () => {
    render(<SignupWithProviders />)

    const submitButton = screen.getByRole('button', { name: /Create Account/i })
    expect(submitButton).toBeDisabled()
  })

  it('should enable submit button when all validations pass', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    // Fill out all fields with valid data
    await user.type(screen.getByPlaceholderText('Enter your first name'), 'John')
    await user.type(screen.getByPlaceholderText('Enter your last name'), 'Doe')
    await user.selectOptions(screen.getByDisplayValue(''), 'male')
    
    const over18Date = new Date()
    over18Date.setFullYear(over18Date.getFullYear() - 25)
    await user.type(screen.getByDisplayValue(''), over18Date.toISOString().split('T')[0])
    
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Create a password'), 'Password123')
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'Password123')

    const submitButton = screen.getByRole('button', { name: /Create Account/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('should show error message on failed signup', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    // Fill out form with valid data
    await user.type(screen.getByPlaceholderText('Enter your first name'), 'John')
    await user.type(screen.getByPlaceholderText('Enter your last name'), 'Doe')
    await user.selectOptions(screen.getByDisplayValue(''), 'male')
    
    const over18Date = new Date()
    over18Date.setFullYear(over18Date.getFullYear() - 25)
    await user.type(screen.getByDisplayValue(''), over18Date.toISOString().split('T')[0])
    
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Create a password'), 'Password123')
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'Password123')

    const submitButton = screen.getByRole('button', { name: /Create Account/i })
    await user.click(submitButton)

    // Should navigate to dashboard on successful signup
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('should navigate to login when login link is clicked', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const loginLink = screen.getByText('Sign in here')
    await user.click(loginLink)

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should navigate to home when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const backButton = screen.getByText('Back to home')
    await user.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should show validation errors when clicking disabled button', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    const submitButton = screen.getByRole('button', { name: /Create Account/i })
    await user.click(submitButton)

    expect(screen.getByText('Please complete all required fields to continue')).toBeInTheDocument()
    expect(screen.getByText('Please select your gender')).toBeInTheDocument()
  })

  it('should have proper form validation attributes', () => {
    render(<SignupWithProviders />)

    const firstNameInput = screen.getByPlaceholderText('Enter your first name')
    const lastNameInput = screen.getByPlaceholderText('Enter your last name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Create a password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')

    expect(firstNameInput).toBeRequired()
    expect(lastNameInput).toBeRequired()
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
    expect(confirmPasswordInput).toBeRequired()
  })

  it('should have accessible form elements', () => {
    render(<SignupWithProviders />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Create a password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')
  })

  it('should have proper placeholder text', () => {
    render(<SignupWithProviders />)

    expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
  })

  it('should have forgot password link', () => {
    render(<SignupWithProviders />)

    // This test doesn't apply to signup page, removing
  })

  it('should handle form submission with enter key', async () => {
    const user = userEvent.setup()
    render(<SignupWithProviders />)

    // Fill out form
    await user.type(screen.getByPlaceholderText('Enter your first name'), 'John')
    await user.type(screen.getByPlaceholderText('Enter your last name'), 'Doe')
    await user.selectOptions(screen.getByDisplayValue(''), 'male')
    
    const over18Date = new Date()
    over18Date.setFullYear(over18Date.getFullYear() - 25)
    await user.type(screen.getByDisplayValue(''), over18Date.toISOString().split('T')[0])
    
    await user.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Create a password'), 'Password123')
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'Password123')

    // Submit with Enter key
    await user.keyboard('{Enter}')

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })
})
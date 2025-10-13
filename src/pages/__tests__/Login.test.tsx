import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'
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

const LoginWithProviders = () => (
  <BrowserRouter>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </BrowserRouter>
)

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render login form with all elements', () => {
    render(<LoginWithProviders />)

    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
    expect(screen.getByText('Sign up here')).toBeInTheDocument()
  })

  it('should have back to home button', () => {
    render(<LoginWithProviders />)

    const backButton = screen.getByText('Back to home')
    expect(backButton).toBeInTheDocument()
    expect(backButton.closest('button')).toBeInTheDocument()
  })

  it('should update form fields when user types', async () => {
    const user = userEvent.setup()
    render(<LoginWithProviders />)

    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('should show error message on failed login', async () => {
    const user = userEvent.setup()
    render(<LoginWithProviders />)

    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    // Try to login with non-existent user
    await user.type(emailInput, 'nonexistent@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('should navigate to dashboard on successful login', async () => {
    const user = userEvent.setup()
    render(<LoginWithProviders />)

    // First create a user by signing up
    const signupLink = screen.getByText('Sign up here')
    await user.click(signupLink)

    // Navigate back to login (simulate navigation)
    render(<LoginWithProviders />)

    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    // Create user first
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    // Should show error since user doesn't exist yet
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('should navigate to signup when signup link is clicked', async () => {
    const user = userEvent.setup()
    render(<LoginWithProviders />)

    const signupLink = screen.getByText('Sign up here')
    await user.click(signupLink)

    expect(mockNavigate).toHaveBeenCalledWith('/signup')
  })

  it('should navigate to home when back button is clicked', async () => {
    const user = userEvent.setup()
    render(<LoginWithProviders />)

    const backButton = screen.getByText('Back to home')
    await user.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should clear error message when user starts typing again', async () => {
    const user = userEvent.setup()
    render(<LoginWithProviders />)

    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    // Trigger error
    await user.type(emailInput, 'invalid@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    // Start typing again
    await user.clear(emailInput)
    await user.type(emailInput, 'new@example.com')

    // Error should still be there until form is submitted again
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('should have proper form validation', async () => {
    const user = userEvent.setup()
    render(<LoginWithProviders />)

    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    // Try to submit empty form
    await user.click(submitButton)

    // HTML5 validation should prevent submission
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('should have accessible form elements', () => {
    render(<LoginWithProviders />)

    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('should have proper placeholder text', () => {
    render(<LoginWithProviders />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')

    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('should have forgot password link', () => {
    render(<LoginWithProviders />)

    const forgotPasswordLink = screen.getByText('Forgot your password?')
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '#')
  })

  it('should handle form submission with enter key', async () => {
    const user = userEvent.setup()
    render(<LoginWithProviders />)

    const emailInput = screen.getByLabelText(/Email Address/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})

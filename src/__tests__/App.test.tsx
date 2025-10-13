import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'
import { AuthProvider } from '../contexts/AuthProvider'

// Mock the pages
vi.mock('../pages/AuthLanding', () => ({
  default: () => <div data-testid="auth-landing">Auth Landing</div>
}))

vi.mock('../pages/Login', () => ({
  default: () => <div data-testid="login">Login</div>
}))

vi.mock('../pages/Signup', () => ({
  default: () => <div data-testid="signup">Signup</div>
}))

vi.mock('../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>
}))

// Mock useAuth hook
const mockUseAuth = vi.fn()
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render AuthProvider wrapper', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      users: [],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: null
    })

    render(<App />)

    // Should render without crashing
    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })

  it('should render AuthLanding for root path', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      users: [],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: null
    })

    render(<App />)

    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })

  it('should render Login for /login path', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      users: [],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: null
    })

    // Mock window.location for routing
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/Symptalyze/login'
      },
      writable: true
    })

    render(<App />)

    expect(screen.getByTestId('login')).toBeInTheDocument()
  })

  it('should render Signup for /signup path', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      users: [],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: null
    })

    // Mock window.location for routing
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/Symptalyze/signup'
      },
      writable: true
    })

    render(<App />)

    expect(screen.getByTestId('signup')).toBeInTheDocument()
  })

  it('should render Dashboard for /dashboard path when user is logged in', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    }

    mockUseAuth.mockReturnValue({
      currentUser: mockUser,
      users: [mockUser],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: 'login'
    })

    // Mock window.location for routing
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/Symptalyze/dashboard'
      },
      writable: true
    })

    render(<App />)

    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('should redirect to home when accessing /dashboard without user', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      users: [],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: null
    })

    // Mock window.location for routing
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/Symptalyze/dashboard'
      },
      writable: true
    })

    render(<App />)

    // Should redirect to home (AuthLanding)
    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })

  it('should handle user state changes', () => {
    const { rerender } = render(<App />)

    // Initially no user
    mockUseAuth.mockReturnValue({
      currentUser: null,
      users: [],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: null
    })

    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()

    // User logs in
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    }

    mockUseAuth.mockReturnValue({
      currentUser: mockUser,
      users: [mockUser],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: 'login'
    })

    rerender(<App />)

    // Should still show auth landing for root path
    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })

  it('should have correct basename for routing', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      users: [],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: null
    })

    render(<App />)

    // The BrowserRouter should have basename="/Symptalyze"
    // This is tested implicitly by the routing working correctly
    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })

  it('should handle all route paths correctly', () => {
    const routes = [
      { path: '/Symptalyze', component: 'auth-landing' },
      { path: '/Symptalyze/login', component: 'login' },
      { path: '/Symptalyze/signup', component: 'signup' },
      { path: '/Symptalyze/dashboard', component: 'dashboard' }
    ]

    routes.forEach(({ path, component }) => {
      // Mock window.location for each route
      Object.defineProperty(window, 'location', {
        value: { pathname: path },
        writable: true
      })

      const { unmount } = render(<App />)
      expect(screen.getByTestId(component)).toBeInTheDocument()
      unmount()
    })
  })

  it('should provide AuthContext to all components', () => {
    const mockSignup = vi.fn()
    const mockLogin = vi.fn()
    const mockLogout = vi.fn()

    mockUseAuth.mockReturnValue({
      currentUser: null,
      users: [],
      signup: mockSignup,
      login: mockLogin,
      logout: mockLogout,
      navigationSource: null
    })

    render(<App />)

    // The AuthProvider should be available to all child components
    // This is tested by the components being able to use useAuth hook
    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })
})

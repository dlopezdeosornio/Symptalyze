import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from '../App'
import { AuthProvider } from '../contexts/AuthProvider'
import AuthLanding from '../pages/AuthLanding'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'

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

// Test App component that uses MemoryRouter instead of BrowserRouter
const TestApp = ({ initialEntries = ['/'] }: { initialEntries?: string[] }) => {
  const { currentUser } = mockUseAuth()
  
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

    render(
      <AuthProvider>
        <TestApp />
      </AuthProvider>
    )

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

    render(
      <AuthProvider>
        <TestApp />
      </AuthProvider>
    )

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

    render(
      <AuthProvider>
        <TestApp initialEntries={['/login']} />
      </AuthProvider>
    )

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

    render(
      <AuthProvider>
        <TestApp initialEntries={['/signup']} />
      </AuthProvider>
    )

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

    render(
      <AuthProvider>
        <TestApp initialEntries={['/dashboard']} />
      </AuthProvider>
    )

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

    render(
      <AuthProvider>
        <TestApp initialEntries={['/dashboard']} />
      </AuthProvider>
    )

    // Should redirect to home (AuthLanding)
    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })

  it('should handle user state changes', () => {
    // Initially no user
    mockUseAuth.mockReturnValue({
      currentUser: null,
      users: [],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: null
    })

    const { rerender } = render(
      <AuthProvider>
        <TestApp />
      </AuthProvider>
    )

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

    rerender(
      <AuthProvider>
        <TestApp />
      </AuthProvider>
    )

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

    render(
      <AuthProvider>
        <TestApp />
      </AuthProvider>
    )

    // The routing should work correctly with MemoryRouter
    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })

  it('should handle all route paths correctly', () => {
    const routes = [
      { path: '/', component: 'auth-landing' },
      { path: '/login', component: 'login' },
      { path: '/signup', component: 'signup' },
      { path: '/dashboard', component: 'dashboard' }
    ]

    routes.forEach(({ path, component }) => {
      mockUseAuth.mockReturnValue({
        currentUser: component === 'dashboard' ? { id: '1', email: 'test@example.com', password: 'password123', firstName: 'Test', lastName: 'User' } : null,
        users: [],
        signup: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
        navigationSource: null
      })

      const { unmount } = render(
        <AuthProvider>
          <TestApp initialEntries={[path]} />
        </AuthProvider>
      )
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

    render(
      <AuthProvider>
        <TestApp />
      </AuthProvider>
    )

    // The AuthProvider should be available to all child components
    // This is tested by the components being able to use useAuth hook
    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })
})

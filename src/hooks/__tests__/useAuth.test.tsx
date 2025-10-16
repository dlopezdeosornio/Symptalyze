import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { AuthContext } from '../../contexts/AuthContext'
import type { AuthContextType } from '../../contexts/AuthContextTypes'
import type { User } from '../../types/user'

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
}

const mockAuthContextValue: AuthContextType = {
  currentUser: mockUser,
  users: [mockUser],
  signup: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  navigationSource: 'login'
}

const createWrapper = (contextValue: AuthContextType) => {
  return ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

describe('useAuth', () => {
  it('should return auth context value when used within AuthProvider', () => {
    const wrapper = createWrapper(mockAuthContextValue)
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current).toEqual(mockAuthContextValue)
    expect(result.current.currentUser).toEqual(mockUser)
    expect(result.current.users).toEqual([mockUser])
    expect(result.current.navigationSource).toBe('login')
  })

  it('should throw error when used outside AuthProvider', () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useAuth())
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })

  it('should return updated context value when context changes', () => {
    const initialValue: AuthContextType = {
      currentUser: null,
      users: [],
      signup: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      navigationSource: null
    }

    const { result } = renderHook(() => useAuth(), { 
      wrapper: createWrapper(initialValue) 
    })

    expect(result.current.currentUser).toBeNull()
    expect(result.current.navigationSource).toBeNull()

    // Test with updated context value in a separate render
    const updatedValue: AuthContextType = {
      ...initialValue,
      currentUser: mockUser,
      navigationSource: 'signup'
    }

    const { result: updatedResult } = renderHook(() => useAuth(), { 
      wrapper: createWrapper(updatedValue) 
    })

    expect(updatedResult.current.currentUser).toEqual(mockUser)
    expect(updatedResult.current.navigationSource).toBe('signup')
  })

  it('should provide all required context methods', () => {
    const wrapper = createWrapper(mockAuthContextValue)
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(typeof result.current.signup).toBe('function')
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
  })

  it('should handle context with undefined value', () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={undefined as any}>
        {children}
      </AuthContext.Provider>
    )

    expect(() => {
      renderHook(() => useAuth(), { wrapper })
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })

  it('should maintain referential stability of context methods', () => {
    const signupMock = vi.fn()
    const loginMock = vi.fn()
    const logoutMock = vi.fn()

    const contextValue: AuthContextType = {
      currentUser: mockUser,
      users: [mockUser],
      signup: signupMock,
      login: loginMock,
      logout: logoutMock,
      navigationSource: 'login'
    }

    const wrapper = createWrapper(contextValue)
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Test that the methods are the same references
    expect(result.current.signup).toBe(signupMock)
    expect(result.current.login).toBe(loginMock)
    expect(result.current.logout).toBe(logoutMock)
  })
})

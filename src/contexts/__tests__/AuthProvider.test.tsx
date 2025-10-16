import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '../AuthProvider'
import { AuthContext } from '../AuthContext'
import type { User } from '../../types/user'

// Test component that uses the auth context
const TestComponent = () => {
  const { currentUser, users, signup, login, logout, navigationSource } = React.useContext(AuthContext)!
  
  return (
    <div>
      <div data-testid="current-user">{currentUser ? currentUser.email : 'No user'}</div>
      <div data-testid="users-count">{users.length}</div>
      <div data-testid="navigation-source">{navigationSource || 'None'}</div>
      <button 
        data-testid="signup-btn" 
        onClick={() => signup({ 
          id: '1', 
          email: 'test@example.com', 
          password: 'password123', 
          firstName: 'Test', 
          lastName: 'User' 
        })}
      >
        Signup
      </button>
      <button 
        data-testid="login-btn" 
        onClick={() => login('test@example.com', 'password123')}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should provide initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('current-user')).toHaveTextContent('No user')
    expect(screen.getByTestId('users-count')).toHaveTextContent('0')
    expect(screen.getByTestId('navigation-source')).toHaveTextContent('None')
  })

  it('should load users and currentUser from localStorage on mount', () => {
    const mockUsers: User[] = [
      { id: '1', email: 'user1@example.com', password: 'pass1', firstName: 'User1', lastName: 'Test' },
      { id: '2', email: 'user2@example.com', password: 'pass2', firstName: 'User2', lastName: 'Test' }
    ]
    const mockCurrentUser: User = mockUsers[0]

    localStorage.setItem('users', JSON.stringify(mockUsers))
    localStorage.setItem('currentUser', JSON.stringify(mockCurrentUser))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('current-user')).toHaveTextContent('user1@example.com')
    expect(screen.getByTestId('users-count')).toHaveTextContent('2')
  })

  it('should handle signup successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('users-count')).toHaveTextContent('0')
    expect(screen.getByTestId('current-user')).toHaveTextContent('No user')

    fireEvent.click(screen.getByTestId('signup-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('users-count')).toHaveTextContent('1')
      expect(screen.getByTestId('current-user')).toHaveTextContent('test@example.com')
      expect(screen.getByTestId('navigation-source')).toHaveTextContent('signup')
    })
  })

  it('should prevent duplicate email signup', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // First signup
    fireEvent.click(screen.getByTestId('signup-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('users-count')).toHaveTextContent('1')
    })

    // Try to signup with same email again
    const signupBtn = screen.getByTestId('signup-btn')
    fireEvent.click(signupBtn)

    // Should still have only 1 user
    expect(screen.getByTestId('users-count')).toHaveTextContent('1')
  })

  it('should handle login successfully', async () => {
    // First create a user
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('signup-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('current-user')).toHaveTextContent('test@example.com')
    })

    // Logout
    fireEvent.click(screen.getByTestId('logout-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('current-user')).toHaveTextContent('No user')
      expect(screen.getByTestId('navigation-source')).toHaveTextContent('None')
    })

    // Login
    fireEvent.click(screen.getByTestId('login-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('current-user')).toHaveTextContent('test@example.com')
      expect(screen.getByTestId('navigation-source')).toHaveTextContent('login')
    })
  })

  it('should handle login with invalid credentials', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Try to login with non-existent user
    fireEvent.click(screen.getByTestId('login-btn'))

    // Should remain logged out
    expect(screen.getByTestId('current-user')).toHaveTextContent('No user')
    expect(screen.getByTestId('users-count')).toHaveTextContent('0')
  })

  it('should save users to localStorage when users change', async () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('signup-btn'))

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('users', expect.any(String))
    })

    setItemSpy.mockRestore()
  })

  it('should save currentUser to localStorage when currentUser changes', async () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('signup-btn'))

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('currentUser', expect.any(String))
    })

    setItemSpy.mockRestore()
  })

  it('should remove currentUser from localStorage when user logs out', async () => {
    const removeItemSpy = vi.spyOn(localStorage, 'removeItem')

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // First login
    fireEvent.click(screen.getByTestId('signup-btn'))
    
    await waitFor(() => {
      expect(screen.getByTestId('current-user')).toHaveTextContent('test@example.com')
    })

    // Then logout
    fireEvent.click(screen.getByTestId('logout-btn'))

    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith('currentUser')
    })

    removeItemSpy.mockRestore()
  })

  it('should handle malformed localStorage data gracefully', () => {
    localStorage.setItem('users', 'invalid-json')
    localStorage.setItem('currentUser', 'invalid-json')

    // Should not throw error
    expect(() => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
    }).not.toThrow()

    // Should have empty state
    expect(screen.getByTestId('users-count')).toHaveTextContent('0')
    expect(screen.getByTestId('current-user')).toHaveTextContent('No user')
  })
})

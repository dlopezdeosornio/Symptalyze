import { useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/user";
import type { AuthContextType } from "./AuthContextTypes";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [navigationSource, setNavigationSource] = useState<'login' | 'signup' | null>(null);

  // Load users and currentUser from localStorage on mount
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem("users");
      const savedCurrentUser = localStorage.getItem("currentUser");
      const savedNavigationSource = localStorage.getItem("navigationSource");
      
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
      
      if (savedCurrentUser) {
        setCurrentUser(JSON.parse(savedCurrentUser));
      }
      
      if (savedNavigationSource) {
        setNavigationSource(savedNavigationSource as 'login' | 'signup');
      }
    } catch (error) {
      // Handle malformed localStorage data gracefully
      console.error("Error loading user data from localStorage:", error);
      // Clear the malformed data
      localStorage.removeItem("users");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("navigationSource");
    }
  }, []);

  // Save users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Save currentUser to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const signup = (newUser: User) => {
    // check if email already exists
    if (users.find((u) => u.email === newUser.email)) {
      return { success: false, message: "Email already registered" };
    }
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setNavigationSource('signup');
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setCurrentUser(found);
      setNavigationSource('login');
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setCurrentUser(null);
    setNavigationSource(null);
    // Note: User-specific data is now stored with user email keys, 
    // so no need to clear global storage on logout
  };

  const value: AuthContextType = {
    currentUser,
    users,
    signup,
    login,
    logout,
    navigationSource,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

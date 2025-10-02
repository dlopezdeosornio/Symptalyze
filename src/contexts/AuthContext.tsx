import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/user";

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  signup: (newUser: User) => { success: boolean; message?: string };
  login: (email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  navigationSource: 'login' | 'signup' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [navigationSource, setNavigationSource] = useState<'login' | 'signup' | null>(null);

  // Load users and currentUser from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    const savedCurrentUser = localStorage.getItem("currentUser");
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
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
    console.log("User signed up:", newUser);
    console.log("All users:", [...users, newUser]);
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const found = users.find((u) => u.email === email && u.password === password);
    console.log("Login attempt:", { email, found: !!found, allUsers: users });
    if (found) {
      setCurrentUser(found);
      setNavigationSource('login');
      console.log("User logged in:", found);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setCurrentUser(null);
    setNavigationSource(null);
    // Clear symptom entries from localStorage when user logs out
    localStorage.removeItem("symptom-entries");
  };

  const value = {
    currentUser,
    users,
    signup,
    login,
    logout,
    navigationSource,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

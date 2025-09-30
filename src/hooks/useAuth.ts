import { useLocalStorage } from "./useLocalStorage";
import type { User } from "../types/user";

export function useAuth() {
  const [users, setUsers] = useLocalStorage<User[]>("users", []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>("currentUser", null);

  const signup = (newUser: User) => {
    // check if email already exists
    if (users.find((u) => u.email === newUser.email)) {
      return { success: false, message: "Email already registered" };
    }
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    // Force immediate localStorage update
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const found = users.find((u) => u.email === email && u.password === password);
    console.log("Login attempt:", { email, found: !!found });
    if (found) {
      setCurrentUser(found);
      // Force immediate localStorage update
      localStorage.setItem("currentUser", JSON.stringify(found));
      console.log("User logged in:", found);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setCurrentUser(null);
    // Clear symptom entries from localStorage when user logs out
    localStorage.removeItem("symptom-entries");
    // Force immediate localStorage update
    localStorage.removeItem("currentUser");
  };

  return { currentUser, users, signup, login, logout };
}
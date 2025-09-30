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
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setCurrentUser(found);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return { currentUser, users, signup, login, logout };
}
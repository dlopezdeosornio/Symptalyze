import type { User } from "../types/user";

export interface AuthContextType {
  currentUser: User | null;
  users: User[];
  signup: (newUser: User) => { success: boolean; message?: string };
  login: (email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  navigationSource: 'login' | 'signup' | null;
}

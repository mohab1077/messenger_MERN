import { createContext, useContext } from "react";

interface AuthContextType {
  email: string | null;
  token: string | null;
  myusername:string | null;
  isAuthenticated: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  email: null,
  token: null,
  myusername:null,
  login: () => {},
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
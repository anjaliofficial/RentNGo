"use client";

import { createContext, SetStateAction, useContext, useEffect, useState } from "react";
import AuthService from "../services/auth.service"; // adjust path if needed
import { RegisterDto } from "@/types/auth.types";

interface User {
  id: string;
  email: string;
  name: string;
  // add other fields from your backend user model
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current user on mount
    AuthService.me()
      .then((res: { data: SetStateAction<User | null>; }) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AuthService.login({ email, password });
    localStorage.setItem("accessToken", res.data.token);
    const me = await AuthService.me();
    setUser(me.data);
  };

  const register = async (data: RegisterDto) => {
    await AuthService.register(data);
    // optionally auto-login after register
  };

  const logout = async () => {
    await AuthService.logout();
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

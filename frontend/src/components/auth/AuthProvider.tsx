"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AuthService from "@/services/auth.service";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "CUSTOMER" | "OWNER" | "MODERATOR" | "ADMIN";
  trustScore: number;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
  emailVerified?: boolean;
  mfaEnabled?: boolean;
  verificationStatus?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    bio?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await AuthService.me();
      setUser(data.user);
    } catch {
      // apiClient refreshes an expired access token once and retries /me.
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AuthService.login({ email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setUser(res.data.user);
  };

  const register = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    bio?: string;
  }) => {
    const res = await AuthService.register(data);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setUser(res.data.user);
  };

  const logout = useCallback(async () => {
    await AuthService.logout().catch(() => undefined);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

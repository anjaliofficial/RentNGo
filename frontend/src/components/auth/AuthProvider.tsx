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
import { getSocket } from "@/lib/socket";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: "customer" | "owner" | "moderator" | "admin";
  trustScore: number;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
  emailVerified?: boolean;
  mfaEnabled?: boolean;
  verificationStatus?: string;
}

/** Backend returns `_id`; normalize to the `id` field this app uses everywhere else. */
const toAuthUser = (raw: any): AuthUser => ({ ...raw, id: raw._id });

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
      // Response shape: { success, message, data: <IUserResponse> }
      const { data } = await AuthService.me();
      setUser(toAuthUser(data.data));
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
    // Response shape: { success, message, data: { user, accessToken, refreshToken } }
    const res = await AuthService.login({ email, password });
    const { user: rawUser, accessToken, refreshToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(toAuthUser(rawUser));
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
    const { user: rawUser, accessToken, refreshToken } = res.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(toAuthUser(rawUser));
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

  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket(user.id);

    const onTrustScoreUpdate = (payload: { trustScore: number }) => {
      setUser((prev) => (prev ? { ...prev, trustScore: payload.trustScore } : prev));
    };

    socket.on("trustScore:update", onTrustScoreUpdate);
    return () => {
      socket.off("trustScore:update", onTrustScoreUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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

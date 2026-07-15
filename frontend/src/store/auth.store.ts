import { create } from "zustand";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  setAuth: (
    user: User,
    accessToken: string,
    refreshToken: string
  ) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  accessToken:
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null,

  refreshToken:
    typeof window !== "undefined"
      ? localStorage.getItem("refreshToken")
      : null,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    set({
      user,
      accessToken,
      refreshToken,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  },
}));
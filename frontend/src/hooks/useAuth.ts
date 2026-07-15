"use client";

import { useEffect } from "react";
import authService from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function useAuth() {
  const { accessToken, user, setAuth } =
    useAuthStore();

  useEffect(() => {
    async function loadUser() {
      if (!accessToken) return;

      try {
        const res = await authService.me();

        setAuth(
          res.data.data,
          accessToken,
          localStorage.getItem("refreshToken")!
        );
      } catch {
        console.log("Not logged in");
      }
    }

    loadUser();
  }, []);

  return user;
}
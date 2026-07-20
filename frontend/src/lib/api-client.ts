import axios from "axios";
import { getAccessTokenClient } from "./cookie-client";

// Route prefixes that require a signed-in session (mirrors the pages that
// wrap themselves in <DashboardLayout>). Everything else — the landing
// page, /browse, listing details, etc. — is public and must not force a
// redirect just because a stale token failed to refresh.
const PROTECTED_PATH_PREFIXES = ["/dashboard", "/bookings", "/settings", "/wishlist", "/help"];

const isProtectedPath = (pathname: string) =>
  PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token before each request
apiClient.interceptors.request.use((config) => {
  const token = getAccessTokenClient();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token is available");
        }
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1"}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        processQueue(err, null);

        // Session is genuinely dead (refresh token expired/invalid too).
        // Only bounce to /login from routes that actually require auth —
        // most of the app (landing page, /browse, listing details, etc.)
        // is public and must keep working for a logged-out visitor even
        // when a stale token sits in localStorage.
        if (typeof window !== "undefined" && isProtectedPath(window.location.pathname)) {
          window.location.href = "/login";
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

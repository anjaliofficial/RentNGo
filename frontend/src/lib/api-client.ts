import axios from "axios";
import { getAccessTokenClient } from "./cookie-client";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((requestConfig) => {
  const token = getAccessTokenClient();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Access token expired - caller can trigger /auth/refresh and retry.
    }
    return Promise.reject(error);
  }
);
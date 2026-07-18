// frontend/src/services/auth.service.ts
import { apiClient } from "../lib/api-client";

class AuthService {
  register(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    bio?: string;
  }) {
    return apiClient.post("/auth/register", data);
  }

  login(data: { email: string; password: string }) {
    return apiClient.post("/auth/login", data);
  }

  me() {
    return apiClient.get("/auth/me");
  }

  refresh(data: { refreshToken: string }) {
    return apiClient.post("/auth/refresh", data);
  }

  logout() {
    return apiClient.post("/auth/logout");
  }
}

export default new AuthService();

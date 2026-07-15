import api from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

class AuthService {
  login(data: LoginData) {
    return api.post("/auth/login", data);
  }

  register(data: RegisterData) {
    return api.post("/auth/register", data);
  }

  me() {
    return api.get("/auth/me");
  }

  logout() {
    localStorage.removeItem("accessToken");
  }
}

export default new AuthService();
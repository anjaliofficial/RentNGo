import api from "./api";
import { RegisterDto } from "@/types/auth.types";

class AuthService {
  register(data: RegisterDto) {
    return api.post("/auth/register", data);
  }

  login(data: {
    email: string;
    password: string;
  }) {
    return api.post("/auth/login", data);
  }

  me() {
    return api.get("/auth/me");
  }

  logout() {
    return api.post("/auth/logout");
  }
}

export default new AuthService();
import { apiClient } from "../lib/api-client";
import { UpdateProfileInput, ChangePasswordInput } from "../types/user.types";

class UserService {
  getPublicProfile(userId: string) {
    return apiClient.get(`/users/${userId}/public-profile`);
  }

  getProfile() {
    return apiClient.get("/users/profile");
  }

  updateProfile(data: UpdateProfileInput) {
    return apiClient.put("/users/profile", data);
  }

  changePassword(data: ChangePasswordInput) {
    return apiClient.patch("/users/change-password", data);
  }

  updateAvatar(avatar: string) {
    return apiClient.patch("/users/avatar", { avatar });
  }
}

export default new UserService();

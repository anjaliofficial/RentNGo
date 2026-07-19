import { apiClient } from "../lib/api-client";

class UserService {
  getPublicProfile(userId: string) {
    return apiClient.get(`/users/${userId}/public-profile`);
  }
}

export default new UserService();

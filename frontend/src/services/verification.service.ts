import { apiClient } from "../lib/api-client";

class VerificationService {
  pending() {
    return apiClient.get("/verifications/pending");
  }

  approve(userId: string) {
    return apiClient.patch(`/verifications/${userId}/approve`);
  }

  reject(userId: string, note?: string) {
    return apiClient.patch(`/verifications/${userId}/reject`, { note });
  }
}

export default new VerificationService();

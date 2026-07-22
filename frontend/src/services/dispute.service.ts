import { apiClient } from "../lib/api-client";
import { CreateDisputeInput } from "../types/dispute.types";

class DisputeService {
  file(data: CreateDisputeInput) {
    return apiClient.post("/disputes", data);
  }

  open() {
    return apiClient.get("/disputes/open");
  }

  getById(id: string) {
    return apiClient.get(`/disputes/${id}`);
  }

  resolve(id: string, data: { outcome: "approved" | "rejected"; note: string }) {
    return apiClient.patch(`/disputes/${id}/resolve`, data);
  }
}

export default new DisputeService();

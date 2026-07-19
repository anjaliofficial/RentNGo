import { apiClient } from "../lib/api-client";
import { CreateFeedbackInput } from "../types/feedback.types";

class FeedbackService {
  getForEquipment(equipmentId: string) {
    return apiClient.get(`/equipment/${equipmentId}/feedback`);
  }

  add(equipmentId: string, data: CreateFeedbackInput) {
    return apiClient.post(`/equipment/${equipmentId}/feedback`, data);
  }

  remove(equipmentId: string, feedbackId: string) {
    return apiClient.delete(`/equipment/${equipmentId}/feedback/${feedbackId}`);
  }
}

export default new FeedbackService();

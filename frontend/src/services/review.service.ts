import { apiClient } from "../lib/api-client";
import { CreateReviewInput } from "../types/review.types";

class ReviewService {
  create(data: CreateReviewInput) {
    return apiClient.post("/reviews", data);
  }

  getForUser(userId: string) {
    return apiClient.get(`/reviews/user/${userId}`);
  }
}

export default new ReviewService();

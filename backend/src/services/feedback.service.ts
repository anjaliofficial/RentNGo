import feedbackRepository from "../repositories/feedback.repository";
import equipmentRepository from "../repositories/equipment.repository";
import notificationService from "./notification.service";

import { CreateFeedbackDto } from "../dto/feedback.dto";

import ApiError from "../error/ApiError";

class FeedbackService {
  /**
   * Add (or update) feedback on a listing — any authenticated user except
   * the listing's own owner.
   */
  async addFeedback(
    userId: string,
    equipmentId: string,
    body: CreateFeedbackDto
  ) {
    const equipment = await equipmentRepository.findRawById(equipmentId);

    if (!equipment) {
      throw new ApiError(404, "Equipment not found.");
    }

    if (equipment.owner.toString() === userId) {
      throw new ApiError(400, "You can't leave feedback on your own listing.");
    }

    const feedback = await feedbackRepository.upsert(equipmentId, userId, {
      rating: body.rating,
      comment: body.comment,
    });

    const stats = await feedbackRepository.computeStats(equipmentId);

    await equipmentRepository.update(equipmentId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
    });

    await notificationService.createAndEmitNotification({
      receiver: equipment.owner.toString(),
      sender: userId,
      title: "New feedback on your listing",
      message: `${equipment.title} received new feedback.`,
      type: "review",
    });

    return feedback;
  }

  /**
   * Get Feedback For A Listing
   */
  async getFeedbackForEquipment(equipmentId: string) {
    return feedbackRepository.findByEquipment(equipmentId);
  }

  /**
   * Delete Feedback (author only)
   */
  async deleteFeedback(feedbackId: string, userId: string) {
    const feedback = await feedbackRepository.findById(feedbackId);

    if (!feedback) {
      throw new ApiError(404, "Feedback not found.");
    }

    if (feedback.user.toString() !== userId) {
      throw new ApiError(403, "You are not allowed to delete this feedback.");
    }

    const equipmentId = feedback.equipment.toString();

    await feedbackRepository.delete(feedbackId);

    const stats = await feedbackRepository.computeStats(equipmentId);

    await equipmentRepository.update(equipmentId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
    });

    return { message: "Feedback deleted successfully." };
  }
}

export default new FeedbackService();

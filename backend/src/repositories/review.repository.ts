import Review from "../models/review.model";

import { IReview } from "../types/review.types";

class ReviewRepository {
  /**
   * Create Review
   */
  async create(
    data: Partial<IReview>
  ): Promise<IReview> {
    return Review.create(data);
  }

  /**
   * Get All Reviews
   */
  async findAll(): Promise<IReview[]> {
    return Review.find()
      .populate("reviewer", "fullName avatar")
      .populate("reviewee", "fullName avatar")
      .populate("equipment", "name images")
      .sort({ createdAt: -1 });
  }

  /**
   * Find Review By ID
   */
  async findById(
    id: string
  ): Promise<IReview | null> {
    return Review.findById(id)
      .populate("reviewer", "fullName avatar")
      .populate("reviewee", "fullName avatar")
      .populate("equipment", "name images");
  }

  /**
   * Find Reviews For User
   */
  async findByUser(
    userId: string
  ): Promise<IReview[]> {
    return Review.find({
      reviewee: userId,
      // Defensive guard: a review should never be attributed to reviewing
      // yourself, even if a bad/legacy record exists (e.g. from before the
      // self-review check existed, or seeded test data).
      reviewer: { $ne: userId },
    })
      .populate("reviewer", "fullName avatar")
      .populate("equipment", "name images")
      .sort({ createdAt: -1 });
  }

  /**
   * Check Existing Review
   */
  async alreadyReviewed(
    bookingId: string,
    reviewerId: string
  ): Promise<boolean> {
    const review = await Review.findOne({
      booking: bookingId,
      reviewer: reviewerId,
    });

    return !!review;
  }

  /**
   * Delete Review
   */
  async delete(
    id: string
  ): Promise<IReview | null> {
    return Review.findByIdAndDelete(id);
  }
}

export default new ReviewRepository();
import reviewRepository from "../repositories/review.repository";
import bookingRepository from "../repositories/booking.repository";

import User from "../models/user.model";

import { CreateReviewDto } from "../dto/review.dto";

import ApiError from "../error/ApiError";

class ReviewService {
  /**
   * Create Review
   */
  async createReview(
    reviewerId: string,
    body: CreateReviewDto
  ) {
    // Booking must exist
    const booking = await bookingRepository.findRawById(
      body.bookingId
    );

    if (!booking) {
      throw new ApiError(404, "Booking not found.");
    }

    // Booking must be completed
    if (booking.bookingStatus !== "completed") {
      throw new ApiError(
        400,
        "Review can only be submitted after the booking is completed."
      );
    }

    // Reviewer must be customer or owner
    const isCustomer =
      booking.customer.toString() === reviewerId;

    const isOwner =
      booking.owner.toString() === reviewerId;

    if (!isCustomer && !isOwner) {
      throw new ApiError(
        403,
        "You are not allowed to review this booking."
      );
    }

    // Determine who is being reviewed
    const revieweeId = isCustomer
      ? booking.owner.toString()
      : booking.customer.toString();

    // Cannot review yourself
    if (revieweeId === reviewerId) {
      throw new ApiError(
        400,
        "You cannot review yourself."
      );
    }

    // One review per booking per reviewer
    const exists =
      await reviewRepository.alreadyReviewed(
        body.bookingId,
        reviewerId
      );

    if (exists) {
      throw new ApiError(
        400,
        "You have already reviewed this booking."
      );
    }

    // Create review
    const review = await reviewRepository.create({
      booking: booking._id,
      reviewer: reviewerId,
      reviewee: revieweeId,
      equipment: booking.equipment,
      rating: body.rating,
      comment: body.comment,
    });

    // Update trust score
    await this.updateTrustScore(
      revieweeId,
      body.rating
    );

    return review;
  }

  /**
   * Update Trust Score
   */
  async updateTrustScore(
    userId: string,
    rating: number
  ) {
    const user = await User.findById(userId);

    if (!user) return;

    let score = user.trustScore;

    switch (rating) {
      case 5:
        score += 5;
        break;

      case 4:
        score += 3;
        break;

      case 3:
        score += 1;
        break;

      case 2:
        score -= 2;
        break;

      case 1:
        score -= 5;
        break;
    }

    // Clamp between 0 and 100
    score = Math.max(0, Math.min(100, score));

    user.trustScore = score;

    await user.save();
  }

  /**
   * Get All Reviews
   */
  async getAllReviews() {
    return reviewRepository.findAll();
  }

  /**
   * Get Review By ID
   */
  async getReviewById(id: string) {
    const review = await reviewRepository.findById(id);

    if (!review) {
      throw new ApiError(404, "Review not found.");
    }

    return review;
  }

  /**
   * Get Reviews For User
   */
  async getUserReviews(userId: string) {
    return reviewRepository.findByUser(userId);
  }

  /**
   * Delete Review
   */
  async deleteReview(id: string) {
    const review = await reviewRepository.findById(id);

    if (!review) {
      throw new ApiError(404, "Review not found.");
    }

    await reviewRepository.delete(id);

    return true;
  }
}

export default new ReviewService();
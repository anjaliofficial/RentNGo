import { Types } from "mongoose";

import EquipmentFeedback from "../models/equipmentFeedback.model";
import { IEquipmentFeedback } from "../types/feedback.types";

class FeedbackRepository {
  /**
   * Create Or Update Feedback (one per user per listing)
   */
  async upsert(
    equipmentId: string,
    userId: string,
    data: { rating: number; comment: string }
  ): Promise<IEquipmentFeedback> {
    return EquipmentFeedback.findOneAndUpdate(
      { equipment: equipmentId, user: userId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  }

  /**
   * Find Feedback For A Listing
   */
  async findByEquipment(equipmentId: string): Promise<IEquipmentFeedback[]> {
    return EquipmentFeedback.find({ equipment: equipmentId })
      .populate("user", "fullName avatar")
      .sort({ createdAt: -1 });
  }

  /**
   * Find One By ID
   */
  async findById(id: string): Promise<IEquipmentFeedback | null> {
    return EquipmentFeedback.findById(id);
  }

  /**
   * Delete Feedback
   */
  async delete(id: string): Promise<IEquipmentFeedback | null> {
    return EquipmentFeedback.findByIdAndDelete(id);
  }

  /**
   * Compute Aggregate Rating Stats For A Listing
   */
  async computeStats(
    equipmentId: string
  ): Promise<{ averageRating: number; totalReviews: number }> {
    const stats = await EquipmentFeedback.aggregate([
      { $match: { equipment: new Types.ObjectId(equipmentId) } },
      {
        $group: {
          _id: "$equipment",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    };
  }
}

export default new FeedbackRepository();

import { Schema, model } from "mongoose";

import { IReview } from "../types/review.types";

const reviewSchema = new Schema<IReview>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    equipment: {
      type: Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One review per reviewer per booking
reviewSchema.index(
  {
    booking: 1,
    reviewer: 1,
  },
  {
    unique: true,
  }
);

export default model<IReview>(
  "Review",
  reviewSchema
);
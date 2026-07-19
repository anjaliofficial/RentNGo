import { Schema, model } from "mongoose";

import { IEquipmentFeedback } from "../types/feedback.types";

const equipmentFeedbackSchema = new Schema<IEquipmentFeedback>(
  {
    equipment: {
      type: Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

// One piece of feedback per user per listing — resubmitting updates it.
equipmentFeedbackSchema.index(
  { equipment: 1, user: 1 },
  { unique: true }
);

export default model<IEquipmentFeedback>(
  "EquipmentFeedback",
  equipmentFeedbackSchema
);

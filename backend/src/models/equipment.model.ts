import { Schema, model } from "mongoose";

import {
  IEquipment,
  EquipmentCategory,
  EquipmentCondition,
  EquipmentStatus,
} from "../types/equipment.types";

const equipmentSchema = new Schema<IEquipment>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: Object.values(EquipmentCategory),
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    condition: {
      type: String,
      enum: Object.values(EquipmentCondition),
      default: EquipmentCondition.GOOD,
    },

    images: {
      type: [String],
      default: [],
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 1,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: Object.values(EquipmentStatus),
      default: EquipmentStatus.AVAILABLE,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IEquipment>(
  "Equipment",
  equipmentSchema
);
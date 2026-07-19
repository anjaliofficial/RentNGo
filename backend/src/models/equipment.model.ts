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
      trim: true,
    },

    category: {
      type: String,
      enum: Object.values(EquipmentCategory),
      required: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
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
      min: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
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
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * -------------------------
 * Database Indexes
 * -------------------------
 */

// Full-text search
equipmentSchema.index({
  title: "text",
  description: "text",
});

// Search Filters
equipmentSchema.index({
  category: 1,
});

equipmentSchema.index({
  location: 1,
});

equipmentSchema.index({
  condition: 1,
});

equipmentSchema.index({
  available: 1,
});

equipmentSchema.index({
  pricePerDay: 1,
});

equipmentSchema.index({
  owner: 1,
});

equipmentSchema.index({
  averageRating: -1,
});

equipmentSchema.index({
  createdAt: -1,
});

export default model<IEquipment>(
  "Equipment",
  equipmentSchema
);
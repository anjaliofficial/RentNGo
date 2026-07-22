import { Schema, model } from "mongoose";

import {
  IDispute,
  DisputeStatus,
  DisputeReason,
  DisputeOutcome,
} from "../types/dispute.types";

const disputeSchema = new Schema<IDispute>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    filedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    against: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      enum: Object.values(DisputeReason),
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    evidence: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(DisputeStatus),
      default: DisputeStatus.OPEN,
    },

    resolutionOutcome: {
      type: String,
      enum: Object.values(DisputeOutcome),
    },

    resolutionNote: {
      type: String,
      default: "",
    },

    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

disputeSchema.index({ booking: 1, status: 1 });

export default model<IDispute>("Dispute", disputeSchema);

import { Document, Types } from "mongoose";

export enum DisputeStatus {
  OPEN = "open",
  RESOLVED = "resolved",
}

export enum DisputeReason {
  DAMAGED = "damaged_equipment",
  MISSING = "missing_equipment",
  OTHER = "other",
}

export enum DisputeOutcome {
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IDispute extends Document {
  booking: Types.ObjectId;

  filedBy: Types.ObjectId;

  against: Types.ObjectId;

  reason: DisputeReason;

  description: string;

  evidence: string[];

  status: DisputeStatus;

  resolutionOutcome?: DisputeOutcome;

  resolutionNote?: string;

  resolvedBy?: Types.ObjectId;

  resolvedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

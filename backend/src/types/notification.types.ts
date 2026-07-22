import { Document, Types } from "mongoose";

export enum NotificationType {
  BOOKING = "booking",
  REVIEW = "review",
  PAYMENT = "payment",
  SYSTEM = "system",
  VERIFICATION_APPROVED = "verification_approved",
  VERIFICATION_REJECTED = "verification_rejected",
  DISPUTE_FILED = "dispute_filed",
  DISPUTE_RESOLVED = "dispute_resolved",
}

export interface INotification extends Document {
  receiver: Types.ObjectId;

  sender?: Types.ObjectId;

  title: string;

  message: string;

  type: NotificationType;

  isRead: boolean;

  createdAt: Date;

  updatedAt: Date;
}
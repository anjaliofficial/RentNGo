import { Document, Types } from "mongoose";

export enum BookingStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  ACTIVE = "active",
  COMPLETED = "completed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  DISPUTED = "disputed",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
}

export enum PickupStatus {
  PENDING = "pending",
  PICKED_UP = "picked_up",
}

export enum ReturnStatus {
  PENDING = "pending",
  RETURNED = "returned",
}

export interface IBooking extends Document {
  customer: Types.ObjectId;

  owner: Types.ObjectId;

  equipment: Types.ObjectId;

  startDate: Date;

  endDate: Date;

  totalDays: number;

  pricePerDay: number;

  securityDeposit: number;

  totalAmount: number;

  bookingStatus: BookingStatus;

  paymentStatus: PaymentStatus;

  pickupStatus: PickupStatus;

  returnStatus: ReturnStatus;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;
}
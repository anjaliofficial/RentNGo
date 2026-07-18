import { Equipment, EquipmentOwner } from "./equipment.types";

export const BOOKING_STATUSES = [
  "pending",
  "accepted",
  "active",
  "completed",
  "rejected",
  "cancelled",
  "disputed",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type PaymentStatus = "pending" | "paid" | "refunded";
export type PickupStatus = "pending" | "picked_up";
export type ReturnStatus = "pending" | "returned";

export interface Booking {
  _id: string;
  customer: EquipmentOwner;
  owner: EquipmentOwner;
  equipment: Equipment;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  securityDeposit: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  pickupStatus: PickupStatus;
  returnStatus: ReturnStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  equipmentId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

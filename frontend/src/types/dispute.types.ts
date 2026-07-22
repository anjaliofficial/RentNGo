import { Booking } from "./booking.types";
import { EquipmentOwner } from "./equipment.types";

export type DisputeReason = "damaged_equipment" | "missing_equipment" | "other";
export type DisputeStatus = "open" | "resolved";
export type DisputeOutcome = "approved" | "rejected";

export interface Dispute {
  _id: string;
  booking: Booking;
  filedBy: EquipmentOwner;
  against: EquipmentOwner;
  reason: DisputeReason;
  description: string;
  evidence: string[];
  status: DisputeStatus;
  resolutionOutcome?: DisputeOutcome;
  resolutionNote?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface CreateDisputeInput {
  bookingId: string;
  reason: DisputeReason;
  description: string;
  evidence?: string[];
}

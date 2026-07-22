export interface CreateDisputeDto {
  bookingId: string;

  reason: "damaged_equipment" | "missing_equipment" | "other";

  description: string;

  evidence?: string[];
}

export interface ResolveDisputeDto {
  outcome: "approved" | "rejected";

  note: string;
}

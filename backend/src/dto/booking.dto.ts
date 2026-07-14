export interface CreateBookingDto {
  equipmentId: string;

  startDate: string;

  endDate: string;

  notes?: string;
}

export interface UpdateBookingStatusDto {
  bookingStatus:
    | "accepted"
    | "rejected"
    | "cancelled"
    | "completed";
}
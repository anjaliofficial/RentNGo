import { EquipmentOwner } from "./equipment.types";

export interface Review {
  _id: string;
  booking: string;
  reviewer: EquipmentOwner;
  reviewee: EquipmentOwner;
  equipment: { _id: string; title?: string; name?: string; images?: string[] };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment: string;
}

import { Document, Types } from "mongoose";

export enum EquipmentCategory {
  CAMERA = "camera",
  DRONE = "drone",
  POWER_TOOL = "power_tool",
  CAMPING = "camping",
  MUSICAL_INSTRUMENT = "musical_instrument",
  PROJECTOR = "projector",
  SPEAKER = "speaker",
  LAPTOP = "laptop",
  GAMING = "gaming",
  SPORTS = "sports",
  OTHER = "other",
}

export enum EquipmentCondition {
  NEW = "new",
  LIKE_NEW = "like_new",
  GOOD = "good",
  FAIR = "fair",
}

export enum EquipmentStatus {
  AVAILABLE = "available",
  RENTED = "rented",
  MAINTENANCE = "maintenance",
  INACTIVE = "inactive",
}

export interface IEquipment extends Document {
  owner: Types.ObjectId;

  title: string;

  description: string;

  category: EquipmentCategory;

  brand: string;

  condition: EquipmentCondition;

  images: string[];

  pricePerDay: number;

  securityDeposit: number;

  location: string;

  available: boolean;

  status: EquipmentStatus;

  averageRating: number;

  totalReviews: number;

  totalBookings: number;

  createdAt: Date;

  updatedAt: Date;
}
export const EQUIPMENT_CATEGORIES = [
  "camera",
  "drone",
  "power_tool",
  "camping",
  "musical_instrument",
  "projector",
  "speaker",
  "laptop",
  "gaming",
  "sports",
  "other",
] as const;

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  camera: "Camera",
  drone: "Drone",
  power_tool: "Power Tool",
  camping: "Camping",
  musical_instrument: "Musical Instrument",
  projector: "Projector",
  speaker: "Speaker",
  laptop: "Laptop",
  gaming: "Gaming",
  sports: "Sports",
  other: "Other",
};

export const EQUIPMENT_CONDITIONS = ["new", "like_new", "good", "fair"] as const;

export type EquipmentCondition = (typeof EQUIPMENT_CONDITIONS)[number];

export const EQUIPMENT_CONDITION_LABELS: Record<EquipmentCondition, string> = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
};

export interface EquipmentOwner {
  _id: string;
  fullName: string;
  email?: string;
  avatar?: string;
  trustScore: number;
}

export interface Equipment {
  _id: string;
  title: string;
  description: string;
  category: EquipmentCategory;
  brand?: string;
  condition: EquipmentCondition;
  images: string[];
  pricePerDay: number;
  securityDeposit: number;
  location: string;
  available: boolean;
  status: string;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  views: number;
  owner: EquipmentOwner;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentSearchParams {
  search?: string;
  owner?: string;
  category?: string;
  location?: string;
  condition?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "latest" | "oldest" | "price" | "rating";
  page?: number;
  limit?: number;
}

export interface EquipmentSearchResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Equipment[];
}

export interface BookedDateRange {
  startDate: string;
  endDate: string;
}

export interface CreateEquipmentInput {
  title: string;
  description: string;
  category: EquipmentCategory;
  brand?: string;
  condition: EquipmentCondition;
  images?: string[];
  pricePerDay: number;
  securityDeposit: number;
  location: string;
  available?: boolean;
}

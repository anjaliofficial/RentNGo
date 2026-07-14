export interface EquipmentSearchDto {
  search?: string;

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
import {
  EquipmentCategory,
  EquipmentCondition,
} from "../types/equipment.types";

export interface CreateEquipmentDto {
  title: string;

  description: string;

  category: EquipmentCategory;

  brand?: string;

  condition: EquipmentCondition;

  images?: string[];

  pricePerDay: number;

  securityDeposit: number;

  location: string;
}

export interface UpdateEquipmentDto {
  title?: string;

  description?: string;

  category?: EquipmentCategory;

  brand?: string;

  condition?: EquipmentCondition;

  images?: string[];

  pricePerDay?: number;

  securityDeposit?: number;

  location?: string;

  available?: boolean;
}
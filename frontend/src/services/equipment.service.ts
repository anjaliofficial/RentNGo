import { apiClient } from "../lib/api-client";
import {
  CreateEquipmentInput,
  Equipment,
  EquipmentSearchParams,
} from "../types/equipment.types";
import { EquipmentCardData } from "../components/equipment/EquipmentCard";
import { resolveMediaUrl } from "../utils/format";

const CATEGORY_COLORS: Record<string, string> = {
  camera: "#0f172a",
  drone: "#1e293b",
  power_tool: "#334155",
  camping: "#0369a1",
  musical_instrument: "#047857",
  projector: "#334155",
  speaker: "#1e293b",
  laptop: "#0f172a",
  gaming: "#0369a1",
  sports: "#047857",
  other: "#334155",
};

export const toEquipmentCardData = (item: Equipment): EquipmentCardData => ({
  id: item._id,
  title: item.title,
  category: item.category,
  dailyRate: item.pricePerDay,
  imageColor: CATEGORY_COLORS[item.category] ?? "#334155",
  image: resolveMediaUrl(item.images?.[0]),
  ownerTrustScore: item.owner?.trustScore ?? 0,
  location: item.location,
  rating: item.averageRating,
});

class EquipmentService {
  search(params: EquipmentSearchParams = {}) {
    return apiClient.get("/equipment/search", { params });
  }

  getById(id: string) {
    return apiClient.get(`/equipment/${id}`);
  }

  getAvailability(id: string) {
    return apiClient.get(`/equipment/${id}/availability`);
  }

  myItems() {
    return apiClient.get("/equipment/my-items");
  }

  create(data: CreateEquipmentInput) {
    return apiClient.post("/equipment", data);
  }

  update(id: string, data: Partial<CreateEquipmentInput>) {
    return apiClient.put(`/equipment/${id}`, data);
  }

  remove(id: string) {
    return apiClient.delete(`/equipment/${id}`);
  }
}

export default new EquipmentService();

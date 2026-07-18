import equipmentRepository from "../repositories/equipment.repository";
import bookingRepository from "../repositories/booking.repository";

import { EquipmentSearchDto } from "../dto/equipment-search.dto";

import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from "../dto/equipment.dto";

import ApiError from "../error/ApiError";
import { Types } from "mongoose";

class EquipmentService {
  /**
   * Create Equipment
   */
  async createEquipment(
    ownerId: string,
    body: CreateEquipmentDto
  ) {
    return equipmentRepository.create({
      ...body,
      owner: new Types.ObjectId(ownerId),
    });
  }

  /**
   * Get All Equipment
   */
  async getAllEquipment() {
    return equipmentRepository.findAll();
  }

  /**
   * Search Equipment
   */
  async searchEquipment(
    filters: EquipmentSearchDto
  ) {
    // Validate page
    if (filters.page && filters.page < 1) {
      filters.page = 1;
    }

    // Validate limit
    if (filters.limit && filters.limit < 1) {
      filters.limit = 10;
    }

    // Validate price range
    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined &&
      filters.minPrice > filters.maxPrice
    ) {
      throw new ApiError(
        400,
        "Minimum price cannot be greater than maximum price."
      );
    }

    return equipmentRepository.search(filters);
  }

  /**
   * Get Equipment By ID
   */
  async getEquipmentById(id: string) {
    const equipment =
      await equipmentRepository.findById(id);

    if (!equipment) {
      throw new ApiError(
        404,
        "Equipment not found."
      );
    }

    return equipment;
  }

  /**
   * Get Booked Date Ranges (availability)
   */
  async getAvailability(id: string) {
    const equipment = await equipmentRepository.findRawById(id);

    if (!equipment) {
      throw new ApiError(404, "Equipment not found.");
    }

    return bookingRepository.findActiveDateRanges(id);
  }

  /**
   * Get Logged In Owner Equipment
   */
  async getMyEquipment(ownerId: string) {
    return equipmentRepository.findByOwner(ownerId);
  }

  /**
   * Update Equipment
   */
  async updateEquipment(
    equipmentId: string,
    ownerId: string,
    body: UpdateEquipmentDto
  ) {
    const equipment =
      await equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw new ApiError(
        404,
        "Equipment not found."
      );
    }

    if (equipment.owner.toString() !== ownerId) {
      throw new ApiError(
        403,
        "You are not allowed to update this equipment."
      );
    }

    return equipmentRepository.update(
      equipmentId,
      body
    );
  }

  /**
   * Delete Equipment
   */
  async deleteEquipment(
    equipmentId: string,
    ownerId: string
  ) {
    const equipment =
      await equipmentRepository.findById(equipmentId);

    if (!equipment) {
      throw new ApiError(
        404,
        "Equipment not found."
      );
    }

    if (equipment.owner.toString() !== ownerId) {
      throw new ApiError(
        403,
        "You are not allowed to delete this equipment."
      );
    }

    await equipmentRepository.delete(equipmentId);

    return {
      message:
        "Equipment deleted successfully.",
    };
  }
}

export default new EquipmentService();
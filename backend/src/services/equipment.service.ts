import mongoose from "mongoose";

import equipmentRepository from "../repositories/equipment.repository";

import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
} from "../dto/equipment.dto";

import ApiError from "../error/ApiError";

class EquipmentService {
  /**
   * Create Equipment
   */
  async createEquipment(
    ownerId: string,
    body: CreateEquipmentDto
  ) {
    const equipment =
      await equipmentRepository.create({
        ...body,
        owner: new mongoose.Types.ObjectId(ownerId),
      });

    return equipment;
  }

  /**
   * Get All Equipment
   */
  async getAllEquipment() {
    return equipmentRepository.findAll();
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
   * Get Logged In User Equipment
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
      await equipmentRepository.findById(
        equipmentId
      );

    if (!equipment) {
      throw new ApiError(
        404,
        "Equipment not found."
      );
    }

    if (
      equipment.owner.toString() !== ownerId
    ) {
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
      await equipmentRepository.findById(
        equipmentId
      );

    if (!equipment) {
      throw new ApiError(
        404,
        "Equipment not found."
      );
    }

    if (
      equipment.owner.toString() !== ownerId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to delete this equipment."
      );
    }

    await equipmentRepository.delete(
      equipmentId
    );

    return {
      message:
        "Equipment deleted successfully.",
    };
  }
}

export default new EquipmentService();
import Equipment from "../models/equipment.model";
import { IEquipment } from "../types/equipment.types";

class EquipmentRepository {
  /**
   * Create Equipment
   */
  async create(
    data: Partial<IEquipment>
  ): Promise<IEquipment> {
    return Equipment.create(data);
  }

  /**
   * Get All Equipment
   */
  async findAll(): Promise<IEquipment[]> {
    return Equipment.find()
      .populate("owner", "fullName email avatar trustScore")
      .sort({ createdAt: -1 });
  }

  /**
   * Get Equipment By ID
   */
  async findById(
    id: string
  ): Promise<IEquipment | null> {
    return Equipment.findById(id).populate(
      "owner",
      "fullName email avatar trustScore"
    );
  }

  /**
   * Get Owner Equipment
   */
  async findByOwner(
    ownerId: string
  ): Promise<IEquipment[]> {
    return Equipment.find({
      owner: ownerId,
    }).sort({
      createdAt: -1,
    });
  }

  /**
   * Update Equipment
   */
  async update(
    id: string,
    data: Partial<IEquipment>
  ): Promise<IEquipment | null> {
    return Equipment.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /**
   * Delete Equipment
   */
  async delete(
    id: string
  ): Promise<IEquipment | null> {
    return Equipment.findByIdAndDelete(id);
  }
}

export default new EquipmentRepository();
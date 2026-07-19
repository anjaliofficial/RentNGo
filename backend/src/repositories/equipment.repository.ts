import Equipment from "../models/equipment.model";
import { IEquipment } from "../types/equipment.types";
import { EquipmentSearchDto } from "../dto/equipment-search.dto";

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

  /**
   * Increment View Count
   */
  async incrementViews(id: string): Promise<void> {
    await Equipment.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    });
  }

/**
 * Advanced Search
 */
async search(
  filters: EquipmentSearchDto
) {
  const {
    search,
    owner,
    category,
    location,
    condition,
    available,
    minPrice,
    maxPrice,
    sort = "latest",
    page = 1,
    limit = 10,
  } = filters;

  const query: any = {};

  // Owner
  if (owner) {
    query.owner = owner;
  }

  // Search
  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Category
  if (category) {
    query.category = category;
  }

  // Location
  if (location) {
    query.location = {
      $regex: location,
      $options: "i",
    };
  }

  // Condition
  if (condition) {
    query.condition = condition;
  }

  // Availability
  if (available !== undefined) {
    query.available = available;
  }

  // Price
  if (
    minPrice !== undefined ||
    maxPrice !== undefined
  ) {
    query.pricePerDay = {};

    if (minPrice !== undefined) {
      query.pricePerDay.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      query.pricePerDay.$lte = maxPrice;
    }
  }

  let sortQuery: any = {
    createdAt: -1,
  };

  switch (sort) {
    case "price":
      sortQuery = {
        pricePerDay: 1,
      };
      break;

    case "rating":
      sortQuery = {
        averageRating: -1,
      };
      break;

    case "oldest":
      sortQuery = {
        createdAt: 1,
      };
      break;

    default:
      sortQuery = {
        createdAt: -1,
      };
  }

  const total = await Equipment.countDocuments(
    query
  );

  const equipment = await Equipment.find(query)
    .populate(
      "owner",
      "fullName avatar trustScore"
    )
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: equipment,
  };
}
/**
 * Raw Find By ID
 */
async findRawById(
  id: string
): Promise<IEquipment | null> {
  return Equipment.findById(id);
}

}
export default new EquipmentRepository();
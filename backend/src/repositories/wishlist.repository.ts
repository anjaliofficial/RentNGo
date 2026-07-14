import Wishlist from "../models/wishlist.model";
import { IWishlist } from "../types/wishlist.types";

class WishlistRepository {
  /**
   * Add To Wishlist
   */
  async add(
    userId: string,
    equipmentId: string
  ): Promise<IWishlist> {
    return Wishlist.create({
      user: userId,
      equipment: equipmentId,
    });
  }

  /**
   * Remove From Wishlist
   */
  async remove(
    userId: string,
    equipmentId: string
  ): Promise<IWishlist | null> {
    return Wishlist.findOneAndDelete({
      user: userId,
      equipment: equipmentId,
    });
  }

  /**
   * Get User Wishlist
   */
  async findByUser(
    userId: string
  ): Promise<IWishlist[]> {
    return Wishlist.find({
      user: userId,
    })
      .populate({
        path: "equipment",
        populate: {
          path: "owner",
          select:
            "fullName email avatar trustScore",
        },
      })
      .sort({
        createdAt: -1,
      });
  }

  /**
   * Check Favorite
   */
  async findByUserAndEquipment(
    userId: string,
    equipmentId: string
  ): Promise<IWishlist | null> {
    return Wishlist.findOne({
      user: userId,
      equipment: equipmentId,
    });
  }

  /**
   * Count User Wishlist
   */
  async countByUser(
    userId: string
  ): Promise<number> {
    return Wishlist.countDocuments({
      user: userId,
    });
  }

  /**
   * Count Equipment Favorites
   */
  async countByEquipment(
    equipmentId: string
  ): Promise<number> {
    return Wishlist.countDocuments({
      equipment: equipmentId,
    });
  }

  /**
   * Clear User Wishlist (Optional)
   */
  async clearWishlist(
    userId: string
  ) {
    return Wishlist.deleteMany({
      user: userId,
    });
  }
}

export default new WishlistRepository();
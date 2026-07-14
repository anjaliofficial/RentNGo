import wishlistRepository from "../repositories/wishlist.repository";
import equipmentRepository from "../repositories/equipment.repository";

import ApiError from "../error/ApiError";

class WishlistService {
  /**
   * Add Equipment To Wishlist
   */
  async addToWishlist(
    userId: string,
    equipmentId: string
  ) {
    // Check equipment exists
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

    // Already in wishlist?
    const existing =
      await wishlistRepository.findByUserAndEquipment(
        userId,
        equipmentId
      );

    if (existing) {
      throw new ApiError(
        400,
        "Equipment is already in your wishlist."
      );
    }

    return wishlistRepository.add(
      userId,
      equipmentId
    );
  }

  /**
   * Remove Equipment From Wishlist
   */
  async removeFromWishlist(
    userId: string,
    equipmentId: string
  ) {
    const wishlist =
      await wishlistRepository.remove(
        userId,
        equipmentId
      );

    if (!wishlist) {
      throw new ApiError(
        404,
        "Wishlist item not found."
      );
    }

    return {
      message:
        "Removed from wishlist successfully.",
    };
  }

  /**
   * Get User Wishlist
   */
  async getMyWishlist(
    userId: string
  ) {
    return wishlistRepository.findByUser(
      userId
    );
  }

  /**
   * Check Favorite
   */
  async isFavorite(
    userId: string,
    equipmentId: string
  ) {
    const wishlist =
      await wishlistRepository.findByUserAndEquipment(
        userId,
        equipmentId
      );

    return {
      isFavorite: !!wishlist,
    };
  }

  /**
   * Count User Wishlist
   */
  async getWishlistCount(
    userId: string
  ) {
    const count =
      await wishlistRepository.countByUser(
        userId
      );

    return {
      count,
    };
  }

  /**
   * Count Equipment Favorites
   */
  async getEquipmentFavoriteCount(
    equipmentId: string
  ) {
    const count =
      await wishlistRepository.countByEquipment(
        equipmentId
      );

    return {
      count,
    };
  }

  /**
   * Clear Wishlist (Optional)
   */
  async clearWishlist(
    userId: string
  ) {
    await wishlistRepository.clearWishlist(
      userId
    );

    return {
      message:
        "Wishlist cleared successfully.",
    };
  }
}

export default new WishlistService();
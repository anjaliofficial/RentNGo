import { Response, NextFunction } from "express";

import wishlistService from "../services/wishlist.service";

import { AuthRequest } from "../middlewares/auth.middleware";

import {
  successResponse,
  createdResponse,
} from "../utils/response";

class WishlistController {
  /**
   * POST /api/v1/wishlist
   */
  async addToWishlist(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { equipmentId } = req.body;

      const result =
        await wishlistService.addToWishlist(
          req.user!.userId,
          equipmentId
        );

      createdResponse(
        res,
        "Added to wishlist successfully.",
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/wishlist/:equipmentId
   */
  async removeFromWishlist(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const equipmentId = req.params
        .equipmentId as string;

      const result =
        await wishlistService.removeFromWishlist(
          req.user!.userId,
          equipmentId
        );

      successResponse(
        res,
        result.message
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/wishlist
   */
  async getMyWishlist(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result =
        await wishlistService.getMyWishlist(
          req.user!.userId
        );

      successResponse(
        res,
        "Wishlist fetched successfully.",
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/wishlist/check/:equipmentId
   */
  async checkFavorite(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const equipmentId = req.params
        .equipmentId as string;

      const result =
        await wishlistService.isFavorite(
          req.user!.userId,
          equipmentId
        );

      successResponse(
        res,
        "Favorite status fetched successfully.",
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/wishlist/count
   */
  async getWishlistCount(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result =
        await wishlistService.getWishlistCount(
          req.user!.userId
        );

      successResponse(
        res,
        "Wishlist count fetched successfully.",
        result
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/wishlist
   */
  async clearWishlist(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result =
        await wishlistService.clearWishlist(
          req.user!.userId
        );

      successResponse(
        res,
        result.message
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new WishlistController();
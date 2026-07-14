import { Router } from "express";

import wishlistController from "../controllers/wishlist.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * All Wishlist Routes
 * Authentication Required
 */

// Get My Wishlist
router.get(
  "/",
  authenticate,
  wishlistController.getMyWishlist
);

// Get Wishlist Count
router.get(
  "/count",
  authenticate,
  wishlistController.getWishlistCount
);

// Check Favorite
router.get(
  "/check/:equipmentId",
  authenticate,
  wishlistController.checkFavorite
);

// Add To Wishlist
router.post(
  "/",
  authenticate,
  wishlistController.addToWishlist
);

// Remove From Wishlist
router.delete(
  "/:equipmentId",
  authenticate,
  wishlistController.removeFromWishlist
);

// Clear Wishlist
router.delete(
  "/",
  authenticate,
  wishlistController.clearWishlist
);

export default router;
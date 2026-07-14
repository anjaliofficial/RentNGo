import { Router } from "express";

import reviewController from "../controllers/review.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

/**
 * Create Review
 */
router.post(
  "/",
  authenticate,
  authorize("customer", "owner"),
  reviewController.createReview
);

/**
 * Get Reviews
 */
router.get(
  "/",
  reviewController.getAllReviews
);

router.get(
  "/user/:userId",
  reviewController.getUserReviews
);

router.get(
  "/:id",
  reviewController.getReviewById
);

/**
 * Delete Review (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  reviewController.deleteReview
);

export default router;
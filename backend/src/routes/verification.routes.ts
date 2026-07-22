import { Router } from "express";

import verificationController from "../controllers/verification.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

/**
 * Get Pending Verifications (Moderator)
 */
router.get(
  "/pending",
  authenticate,
  authorize("moderator", "admin"),
  verificationController.getPending
);

/**
 * Approve Verification (Moderator)
 */
router.patch(
  "/:id/approve",
  authenticate,
  authorize("moderator", "admin"),
  verificationController.approve
);

/**
 * Reject Verification (Moderator)
 */
router.patch(
  "/:id/reject",
  authenticate,
  authorize("moderator", "admin"),
  verificationController.reject
);

export default router;

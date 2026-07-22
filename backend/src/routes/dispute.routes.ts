import { Router } from "express";

import disputeController from "../controllers/dispute.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize, MEMBER_ROLES } from "../middlewares/role.middleware";

const router = Router();

/**
 * File Dispute
 */
router.post(
  "/",
  authenticate,
  authorize(...MEMBER_ROLES),
  disputeController.createDispute
);

/**
 * Get Open Disputes (Moderator)
 */
router.get(
  "/open",
  authenticate,
  authorize("moderator", "admin"),
  disputeController.getOpenDisputes
);

/**
 * Get Dispute By ID
 */
router.get("/:id", authenticate, disputeController.getDisputeById);

/**
 * Resolve Dispute (Moderator)
 */
router.patch(
  "/:id/resolve",
  authenticate,
  authorize("moderator", "admin"),
  disputeController.resolveDispute
);

export default router;

import { Router } from "express";

import userController from "../controllers/user.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticate);

/**
 * GET Profile
 */
router.get(
  "/profile",
  userController.getProfile
);

/**
 * Update Profile
 */
router.put(
  "/profile",
  userController.updateProfile
);

/**
 * Change Password
 */
router.patch(
  "/change-password",
  userController.changePassword
);

/**
 * Update Avatar
 */
router.patch(
  "/avatar",
  userController.updateAvatar
);

/**
 * Government ID Verification
 */
router.patch(
  "/verify-id",
  userController.verifyGovernmentId
);

export default router;
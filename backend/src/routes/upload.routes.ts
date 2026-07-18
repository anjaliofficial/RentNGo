import { Router } from "express";

import uploadController from "../controllers/upload.controller";
import upload from "../middlewares/upload.middleware";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize, MEMBER_ROLES } from "../middlewares/role.middleware";

const router = Router();

/**
 * Upload Single Image
 */
router.post(
  "/",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  upload.single("image"),
  uploadController.uploadSingle
);

/**
 * Upload Multiple Images
 */
router.post(
  "/multiple",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  upload.array("images", 5),
  uploadController.uploadMultiple
);

export default router;
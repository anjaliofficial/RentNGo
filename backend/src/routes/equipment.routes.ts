import { Router } from "express";

import equipmentController from "../controllers/equipment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize, MEMBER_ROLES } from "../middlewares/role.middleware";
const router = Router();

/**
 * Public Routes
 */

// Public
router.get("/", equipmentController.getAllEquipment);

// Public — must be registered before "/:id" so "search" isn't swallowed as an id
router.get("/search", equipmentController.searchEquipment);

// Protected
router.get(
  "/my-items",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  equipmentController.getMyEquipment
);

// Public
router.get("/:id", equipmentController.getEquipmentById);

// Public
router.get(
  "/:id/availability",
  equipmentController.getAvailability
);

// Protected
router.post(
  "/",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  equipmentController.createEquipment
);

router.put(
  "/:id",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  equipmentController.updateEquipment
);

router.delete(
  "/:id",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  equipmentController.deleteEquipment
);

export default router;
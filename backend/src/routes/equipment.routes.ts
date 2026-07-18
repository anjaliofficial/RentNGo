import { Router } from "express";

import equipmentController from "../controllers/equipment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
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
  authorize("owner", "admin"),
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
  authorize("owner", "admin"),
  equipmentController.createEquipment
);

router.put(
  "/:id",
  authenticate,
  authorize("owner", "admin"),
  equipmentController.updateEquipment
);

router.delete(
  "/:id",
  authenticate,
  authorize("owner", "admin"),
  equipmentController.deleteEquipment
);

export default router;
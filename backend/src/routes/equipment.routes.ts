import { Router } from "express";

import equipmentController from "../controllers/equipment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
const router = Router();

/**
 * Public Routes
 */// Public
router.get("/", equipmentController.getAllEquipment);

// Protected
router.get(
  "/my-items",
  authenticate,
  authorize("owner", "admin"),
  equipmentController.getMyEquipment
);

// Public
router.get("/:id", equipmentController.getEquipmentById);

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

router.get(
  "/",
  equipmentController.getAllEquipment
);
// Admin Routes

export default router;
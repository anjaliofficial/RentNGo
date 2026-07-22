import { Router } from "express";

import adminController from "../controllers/admin.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

/**
 * All Admin Routes — Admin Only
 */
router.use(authenticate, authorize("admin"));

/**
 * Manage Users (Customers/Owners)
 */
router.get("/users", adminController.getCustomers);
router.patch("/users/:id/suspend", adminController.suspendUser);
router.patch("/users/:id/reinstate", adminController.reinstateUser);

/**
 * Manage Moderators
 */
router.get("/moderators", adminController.getModerators);
router.patch("/moderators/:id/promote", adminController.promoteModerator);
router.patch("/moderators/:id/demote", adminController.demoteModerator);

export default router;

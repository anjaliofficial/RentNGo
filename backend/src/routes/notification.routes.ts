import { Router } from "express";

import notificationController from "../controllers/notification.controller";

import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * All Notification Routes
 * Require Authentication
 */

// Get all notifications
router.get(
  "/",
  authenticate,
  notificationController.getMyNotifications
);

// Get unread notifications
router.get(
  "/unread",
  authenticate,
  notificationController.getUnreadNotifications
);

// Get unread notification count
router.get(
  "/unread/count",
  authenticate,
  notificationController.getUnreadCount
);

// Create notification
// (Mainly used internally or by admin)
router.post(
  "/",
  authenticate,
  notificationController.createNotification
);

// Mark one notification as read
router.patch(
  "/:id/read",
  authenticate,
  notificationController.markAsRead
);

// Mark all notifications as read
router.patch(
  "/read-all",
  authenticate,
  notificationController.markAllAsRead
);

// Delete notification
router.delete(
  "/:id",
  authenticate,
  notificationController.deleteNotification
);

export default router;
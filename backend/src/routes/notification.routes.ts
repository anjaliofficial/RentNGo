import { Router } from "express";

import notificationController from "../controllers/notification.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import router from "./upload.routes";

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

// ---------------------------------------------------------------------
// BEFORE (vulnerable) - Finding 4: Broken Access Control / Notification Spoofing
// Any authenticated user could hit this endpoint and set an arbitrary
// "sender" in the request body, letting them impersonate an admin or
// moderator and send phishing-style notifications to any user:

  router.post(
    "/",
    authenticate,
    notificationController.createNotification
  );
//
// ---------------------------------------------------------------------
// AFTER (fixed): authorize("admin") restricts this endpoint to admins
// only. Every other part of the app creates notifications server-side
// via notificationService.createAndEmitNotification(), where the sender
// is derived from trusted server logic, never from client input.
// Create notification (admin only)
router.post(
  "/",
  authenticate,
  authorize("admin"),

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
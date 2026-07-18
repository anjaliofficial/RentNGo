import { Router } from "express";

import bookingController from "../controllers/booking.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize, MEMBER_ROLES } from "../middlewares/role.middleware";

const router = Router();

/**
 * Customer
 */

// Create booking
router.post(
  "/",
  authenticate,
  authorize(...MEMBER_ROLES),
  bookingController.createBooking
);

// My bookings
router.get(
  "/my-bookings",
  authenticate,
  authorize(...MEMBER_ROLES),
  bookingController.getMyBookings
);

/**
 * Owner
 */

// Owner bookings
router.get(
  "/owner",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  bookingController.getOwnerBookings
);

// Accept booking
router.patch(
  "/:id/accept",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  bookingController.acceptBooking
);

// Reject booking
router.patch(
  "/:id/reject",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  bookingController.rejectBooking
);

// Confirm pickup (accepted -> active)
router.patch(
  "/:id/pickup",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  bookingController.confirmPickup
);

// Complete booking (active -> completed)
router.patch(
  "/:id/complete",
  authenticate,
  authorize(...MEMBER_ROLES, "admin"),
  bookingController.completeBooking
);

/**
 * Customer Cancel
 */

router.patch(
  "/:id/cancel",
  authenticate,
  authorize(...MEMBER_ROLES),
  bookingController.cancelBooking
);

/**
 * Public/Admin
 */

// All bookings
router.get(
  "/",
  authenticate,
  authorize("admin"),
  bookingController.getAllBookings
);

// Booking by id
router.get(
  "/:id",
  authenticate,
  bookingController.getBookingById
);

export default router;
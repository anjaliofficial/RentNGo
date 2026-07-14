import { Router } from "express";

import bookingController from "../controllers/booking.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

/**
 * Customer
 */

// Create booking
router.post(
  "/",
  authenticate,
  authorize("customer"),
  bookingController.createBooking
);

// My bookings
router.get(
  "/my-bookings",
  authenticate,
  authorize("customer"),
  bookingController.getMyBookings
);

/**
 * Owner
 */

// Owner bookings
router.get(
  "/owner",
  authenticate,
  authorize("owner", "admin"),
  bookingController.getOwnerBookings
);

// Accept booking
router.patch(
  "/:id/accept",
  authenticate,
  authorize("owner", "admin"),
  bookingController.acceptBooking
);

// Reject booking
router.patch(
  "/:id/reject",
  authenticate,
  authorize("owner", "admin"),
  bookingController.rejectBooking
);

// Complete booking
router.patch(
  "/:id/complete",
  authenticate,
  authorize("owner", "admin"),
  bookingController.completeBooking
);

/**
 * Customer Cancel
 */

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("customer"),
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
import { Request, Response, NextFunction } from "express";

import bookingService from "../services/booking.service";

import { CreateBookingDto } from "../dto/booking.dto";

import { AuthRequest } from "../middlewares/auth.middleware";

import {
  createdResponse,
  successResponse,
} from "../utils/response";

class BookingController {
  /**
   * POST /api/v1/bookings
   */
  async createBooking(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body: CreateBookingDto = req.body;

      const booking =
        await bookingService.createBooking(
          req.user!.userId,
          body
        );

      createdResponse(
        res,
        "Booking created successfully.",
        booking
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings
   */
  async getAllBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const bookings =
        await bookingService.getAllBookings();

      successResponse(
        res,
        "Bookings fetched successfully.",
        bookings
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings/:id
   *
   * BEFORE (vulnerable) - Finding 3: IDOR on Bookings
   * `req` was typed as the plain Express `Request`, and only the booking
   * ID was passed to the service — the requester's identity was never
   * available to check ownership against:
   *
   *   async getBookingById(req: Request, res: Response, next: NextFunction) {
   *     const booking = await bookingService.getBookingById(req.params.id as string);
   *     ...
   *
   * AFTER (fixed): `AuthRequest` carries the authenticated user, and their
   * ID + role are passed through so the service can enforce ownership.
   */
  async getBookingById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const booking =
        await bookingService.getBookingById(
          req.params.id as string,
          req.user!.userId,
          req.user!.role
        );

      successResponse(
        res,
        "Booking fetched successfully.",
        booking
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings/my-bookings
   */
  async getMyBookings(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const bookings =
        await bookingService.getMyBookings(
          req.user!.userId
        );

      successResponse(
        res,
        "My bookings fetched successfully.",
        bookings
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/bookings/owner
   */
  async getOwnerBookings(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const bookings =
        await bookingService.getOwnerBookings(
          req.user!.userId
        );

      successResponse(
        res,
        "Owner bookings fetched successfully.",
        bookings
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/bookings/:id/accept
   */
  async acceptBooking(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const booking =
        await bookingService.acceptBooking(
          req.params.id as string,
          req.user!.userId
        );

      successResponse(
        res,
        "Booking accepted successfully.",
        booking
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/bookings/:id/reject
   */
  async rejectBooking(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const booking =
        await bookingService.rejectBooking(
          req.params.id as string,
          req.user!.userId
        );

      successResponse(
        res,
        "Booking rejected successfully.",
        booking
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/bookings/:id/cancel
   */
  async cancelBooking(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const booking =
        await bookingService.cancelBooking(
          req.params.id as string,
          req.user!.userId
        );

      successResponse(
        res,
        "Booking cancelled successfully.",
        booking
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/bookings/:id/pickup
   */
  async confirmPickup(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const booking =
        await bookingService.confirmPickup(
          req.params.id as string,
          req.user!.userId
        );

      successResponse(
        res,
        "Pickup confirmed successfully.",
        booking
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/bookings/:id/complete
   */
  async completeBooking(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const booking =
        await bookingService.completeBooking(
          req.params.id as string,
          req.user!.userId
        );

      successResponse(
        res,
        "Booking completed successfully.",
        booking
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();
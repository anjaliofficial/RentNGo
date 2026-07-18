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
   */
  async getBookingById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const booking =
        await bookingService.getBookingById(
          req.params.id as string
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
import bookingRepository from "../repositories/booking.repository";
import equipmentRepository from "../repositories/equipment.repository";
import notificationService from "./notification.service";
import { Types } from "mongoose";

import { CreateBookingDto } from "../dto/booking.dto";

import ApiError from "../error/ApiError";

class BookingService {
  /**
   * Create Booking
   */
  async createBooking(
    customerId: string,
    body: CreateBookingDto
  ) {
    const equipment =
      await equipmentRepository.findById(
        body.equipmentId
      );

    if (!equipment) {
      throw new ApiError(
        404,
        "Equipment not found."
      );
    }

    // Owner cannot rent own equipment
    if (
      equipment.owner.toString() === customerId
    ) {
      throw new ApiError(
        400,
        "You cannot book your own equipment."
      );
    }

    // Equipment must be available
    if (!equipment.available) {
      throw new ApiError(
        400,
        "Equipment is currently unavailable."
      );
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    // Date validation
    if (startDate >= endDate) {
      throw new ApiError(
        400,
        "End date must be after start date."
      );
    }

    // Overlap check
    const overlap =
      await bookingRepository.hasOverlap(
        body.equipmentId,
        startDate,
        endDate
      );

    if (overlap) {
      throw new ApiError(
        400,
        "Equipment is already booked for the selected dates."
      );
    }

    // Calculate total days
    const totalDays = Math.ceil(
      (endDate.getTime() -
        startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Calculate amount
    const totalAmount =
      totalDays * equipment.pricePerDay +
      equipment.securityDeposit;

    const booking =
      await bookingRepository.create({
        customer: new Types.ObjectId(customerId),
        owner: equipment.owner,
        equipment: equipment._id,

        startDate,
        endDate,

        totalDays,

        pricePerDay:
          equipment.pricePerDay,

        securityDeposit:
          equipment.securityDeposit,

        totalAmount,

        notes: body.notes,
      });

    await notificationService.createAndEmitNotification({
      receiver: equipment.owner.toString(),
      sender: customerId,
      title: "New booking request",
      message: `A new booking request was created for ${equipment.title}.`,
      type: "booking",
    });

    return booking;
  }

  /**
   * Get All Bookings
   */
  async getAllBookings() {
    return bookingRepository.findAll();
  }

  /**
   * Get Booking By ID
   */
  async getBookingById(id: string) {
    const booking =
      await bookingRepository.findById(id);

    if (!booking) {
      throw new ApiError(
        404,
        "Booking not found."
      );
    }

    return booking;
  }

  /**
   * Customer Bookings
   */
  async getMyBookings(
    customerId: string
  ) {
    return bookingRepository.findCustomerBookings(
      customerId
    );
  }

  /**
   * Owner Bookings
   */
  async getOwnerBookings(
    ownerId: string
  ) {
    return bookingRepository.findOwnerBookings(
      ownerId
    );
  }

  /**
   * Accept Booking
   */
  async acceptBooking(
    bookingId: string,
    ownerId: string
  ) {
    const booking =
      await bookingRepository.findRawById(
        bookingId
      );

    if (!booking) {
      throw new ApiError(
        404,
        "Booking not found."
      );
    }

    if (
      booking.owner.toString() !== ownerId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to accept this booking."
      );
    }

    const updatedBooking = await bookingRepository.update(
      bookingId,
      {
        bookingStatus: "accepted" as any,
      }
    );

    await notificationService.createAndEmitNotification({
      receiver: booking.customer.toString(),
      sender: ownerId,
      title: "Booking accepted",
      message: "Your booking request has been accepted.",
      type: "booking",
    });

    return updatedBooking;
  }

  /**
   * Reject Booking
   */
  async rejectBooking(
    bookingId: string,
    ownerId: string
  ) {
    const booking =
      await bookingRepository.findRawById(
        bookingId
      );

    if (!booking) {
      throw new ApiError(
        404,
        "Booking not found."
      );
    }

    if (
      booking.owner.toString() !== ownerId
    ) {
      throw new ApiError(
        403,
        "You are not allowed to reject this booking."
      );
    }

    const updatedBooking = await bookingRepository.update(
      bookingId,
      {
        bookingStatus: "rejected" as any,
      }
    );

    await notificationService.createAndEmitNotification({
      receiver: booking.customer.toString(),
      sender: ownerId,
      title: "Booking rejected",
      message: "Your booking request has been rejected.",
      type: "booking",
    });

    return updatedBooking;
  }

  /**
   * Cancel Booking
   */
  async cancelBooking(
    bookingId: string,
    customerId: string
  ) {
    const booking =
      await bookingRepository.findRawById(
        bookingId
      );

    if (!booking) {
      throw new ApiError(
        404,
        "Booking not found."
      );
    }

    if (
      booking.customer.toString() !==
      customerId
    ) {
      throw new ApiError(
        403,
        "You cannot cancel this booking."
      );
    }

    const updatedBooking = await bookingRepository.update(
      bookingId,
      {
        bookingStatus: "cancelled" as any,
      }
    );

    await notificationService.createAndEmitNotification({
      receiver: booking.owner.toString(),
      sender: customerId,
      title: "Booking cancelled",
      message: "The customer cancelled this booking.",
      type: "booking",
    });

    return updatedBooking;
  }

  /**
   * Complete Booking
   */
  async completeBooking(
    bookingId: string,
    ownerId: string
  ) {
    const booking =
      await bookingRepository.findRawById(
        bookingId
      );

    if (!booking) {
      throw new ApiError(
        404,
        "Booking not found."
      );
    }

    if (
      booking.owner.toString() !== ownerId
    ) {
      throw new ApiError(
        403,
        "You cannot complete this booking."
      );
    }

    const updatedBooking = await bookingRepository.update(
      bookingId,
      {
        bookingStatus: "completed" as any,
      }
    );

    await notificationService.createAndEmitNotification({
      receiver: booking.customer.toString(),
      sender: ownerId,
      title: "Booking completed",
      message: "Your booking has been marked as completed.",
      type: "booking",
    });

    return updatedBooking;
  }
}

export default new BookingService();
import Booking from "../models/booking.model";

import { IBooking } from "../types/booking.types";

const activeBookingStatuses = [
  "pending",
  "accepted",
  "active",
] as const;

class BookingRepository {
  /**
   * Create Booking
   */
  async create(
    data: Partial<IBooking>
  ): Promise<IBooking> {
    return Booking.create(data);
  }

  /**
   * Find Booking By ID
   */
  async findById(
    id: string
  ): Promise<IBooking | null> {
    return Booking.findById(id)
      .populate(
        "customer",
        "fullName email avatar trustScore"
      )
      .populate(
        "owner",
        "fullName email avatar trustScore"
      )
      .populate("equipment");
  }

  /**
   * Find Raw Booking
   */
  async findRawById(
    id: string
  ): Promise<IBooking | null> {
    return Booking.findById(id);
  }

  /**
   * Get All Bookings
   */
  async findAll(): Promise<IBooking[]> {
    return Booking.find()
      .populate("customer", "fullName email")
      .populate("owner", "fullName email")
      .populate("equipment")
      .sort({ createdAt: -1 });
  }

  /**
   * Customer Bookings
   */
  async findCustomerBookings(
    customerId: string
  ): Promise<IBooking[]> {
    return Booking.find({
      customer: customerId,
    })
      .populate("equipment")
      .sort({
        createdAt: -1,
      });
  }

  /**
   * Owner Bookings
   */
  async findOwnerBookings(
    ownerId: string
  ): Promise<IBooking[]> {
    return Booking.find({
      owner: ownerId,
    })
      .populate("equipment")
      .populate("customer", "fullName email")
      .sort({
        createdAt: -1,
      });
  }

  /**
   * Update Booking
   */
  async update(
    id: string,
    data: Partial<IBooking>
  ): Promise<IBooking | null> {
    return Booking.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /**
   * Delete Booking
   */
  async delete(
    id: string
  ): Promise<IBooking | null> {
    return Booking.findByIdAndDelete(id);
  }

  /**
   * Check Overlapping Booking
   */
  async hasOverlap(
    equipmentId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const booking = await Booking.findOne({
      equipment: equipmentId,
      bookingStatus: {
        $in: [...activeBookingStatuses] as any,
      },
      startDate: {
        $lte: endDate,
      },
      endDate: {
        $gte: startDate,
      },
    } as any);

    return !!booking;
  }
}

export default new BookingRepository();
import Dispute from "../models/dispute.model";

import { IDispute } from "../types/dispute.types";

class DisputeRepository {
  /**
   * Create Dispute
   */
  async create(data: Partial<IDispute>): Promise<IDispute> {
    return Dispute.create(data);
  }

  /**
   * Find Open Disputes (moderator queue)
   */
  async findOpen(): Promise<IDispute[]> {
    return Dispute.find({ status: "open" } as any)
      .populate({
        path: "booking",
        populate: { path: "equipment", select: "title images" },
      })
      .populate("filedBy", "fullName avatar")
      .populate("against", "fullName avatar")
      .sort({ createdAt: -1 });
  }

  /**
   * Find Dispute By ID
   */
  async findById(id: string): Promise<IDispute | null> {
    return Dispute.findById(id)
      .populate({
        path: "booking",
        populate: { path: "equipment", select: "title images" },
      })
      .populate("filedBy", "fullName avatar")
      .populate("against", "fullName avatar");
  }

  /**
   * Find Open Dispute For A Booking
   */
  async findOpenByBooking(bookingId: string): Promise<IDispute | null> {
    return Dispute.findOne({ booking: bookingId, status: "open" } as any);
  }

  /**
   * Update Dispute
   */
  async update(
    id: string,
    data: Partial<IDispute>
  ): Promise<IDispute | null> {
    return Dispute.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }
}

export default new DisputeRepository();

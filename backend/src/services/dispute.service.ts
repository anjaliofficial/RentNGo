import { Types } from "mongoose";

import disputeRepository from "../repositories/dispute.repository";
import bookingRepository from "../repositories/booking.repository";
import notificationService from "./notification.service";

import { CreateDisputeDto, ResolveDisputeDto } from "../dto/dispute.dto";

import ApiError from "../error/ApiError";

class DisputeService {
  /**
   * File Dispute
   */
  async fileDispute(filerId: string, body: CreateDisputeDto) {
    const booking = await bookingRepository.findRawById(body.bookingId);

    if (!booking) {
      throw new ApiError(404, "Booking not found.");
    }

    const isCustomer = booking.customer.toString() === filerId;
    const isOwner = booking.owner.toString() === filerId;

    if (!isCustomer && !isOwner) {
      throw new ApiError(
        403,
        "You are not allowed to file a dispute on this booking."
      );
    }

    if (
      booking.bookingStatus !== "active" &&
      booking.bookingStatus !== "completed"
    ) {
      throw new ApiError(
        400,
        "A dispute can only be filed on an active or completed booking."
      );
    }

    const existing = await disputeRepository.findOpenByBooking(
      body.bookingId
    );

    if (existing) {
      throw new ApiError(
        400,
        "This booking already has an open dispute."
      );
    }

    const against = isCustomer ? booking.owner : booking.customer;

    const dispute = await disputeRepository.create({
      booking: booking._id,
      filedBy: new Types.ObjectId(filerId),
      against,
      reason: body.reason as never,
      description: body.description,
      evidence: body.evidence ?? [],
    });

    await bookingRepository.update(body.bookingId, {
      bookingStatus: "disputed" as any,
    });

    await notificationService.createAndEmitNotification({
      receiver: against.toString(),
      sender: filerId,
      title: "A dispute was filed",
      message: "A dispute was filed on one of your bookings.",
      type: "dispute_filed",
    });

    return dispute;
  }

  /**
   * Get Open Disputes (moderator queue)
   */
  async getOpenDisputes() {
    return disputeRepository.findOpen();
  }

  /**
   * Get Dispute By ID
   */
  async getDisputeById(
    id: string,
    requesterId: string,
    requesterRole: string
  ) {
    const dispute = await disputeRepository.findById(id);

    if (!dispute) {
      throw new ApiError(404, "Dispute not found.");
    }

    const filedById = ((dispute.filedBy as any)._id ?? dispute.filedBy).toString();
    const againstId = ((dispute.against as any)._id ?? dispute.against).toString();

    const isParticipant =
      filedById === requesterId || againstId === requesterId;

    const isModerator =
      requesterRole === "moderator" || requesterRole === "admin";

    if (!isParticipant && !isModerator) {
      throw new ApiError(
        403,
        "You are not allowed to view this dispute."
      );
    }

    return dispute;
  }

  /**
   * Resolve Dispute
   */
  async resolveDispute(
    disputeId: string,
    moderatorId: string,
    body: ResolveDisputeDto
  ) {
    const dispute = await disputeRepository.findById(disputeId);

    if (!dispute) {
      throw new ApiError(404, "Dispute not found.");
    }

    if (dispute.status === "resolved") {
      throw new ApiError(400, "This dispute has already been resolved.");
    }

    const updated = await disputeRepository.update(disputeId, {
      status: "resolved" as any,
      resolutionOutcome: body.outcome as any,
      resolutionNote: body.note,
      resolvedBy: new Types.ObjectId(moderatorId),
      resolvedAt: new Date(),
    });

    const bookingId = (dispute.booking as any)._id ?? dispute.booking;

    await bookingRepository.update(bookingId.toString(), {
      bookingStatus: "completed" as any,
      returnStatus: "returned" as any,
    });

    const filedById = (dispute.filedBy as any)._id ?? dispute.filedBy;
    const againstId = (dispute.against as any)._id ?? dispute.against;

    const message = `Your dispute was resolved: ${body.outcome}. ${body.note}`;

    await Promise.all([
      notificationService.createAndEmitNotification({
        receiver: filedById.toString(),
        sender: moderatorId,
        title: "Dispute resolved",
        message,
        type: "dispute_resolved",
      }),
      notificationService.createAndEmitNotification({
        receiver: againstId.toString(),
        sender: moderatorId,
        title: "Dispute resolved",
        message,
        type: "dispute_resolved",
      }),
    ]);

    return updated;
  }
}

export default new DisputeService();

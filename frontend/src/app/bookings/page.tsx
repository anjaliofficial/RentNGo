"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { CalendarDays, MessageCircle, Star } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Badge, Modal } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import bookingService from "@/services/booking.service";
import reviewService from "@/services/review.service";
import chatService from "@/services/chat.service";
import disputeService from "@/services/dispute.service";
import uploadService from "@/services/upload.service";
import { resolveMediaUrl } from "@/utils/format";
import { Booking, BookingStatus } from "@/types/booking.types";
import { DisputeReason } from "@/types/dispute.types";

const STATUS_TONE: Record<BookingStatus, "warning" | "trust" | "success" | "danger"> = {
  pending: "warning",
  accepted: "trust",
  active: "trust",
  completed: "success",
  rejected: "danger",
  cancelled: "danger",
  disputed: "danger",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  active: "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

export default function BookingsPage() {
  const router = useRouter();
  const [myRentals, setMyRentals] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [messagingId, setMessagingId] = useState<string | null>(null);
  const [disputeTarget, setDisputeTarget] = useState<Booking | null>(null);

  const messageAbout = async (booking: Booking, recipientId: string) => {
    try {
      setMessagingId(booking._id);
      const { data } = await chatService.start({
        recipientId,
        equipmentId: booking.equipment._id,
      });
      router.push(`/dashboard/messages/${data.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not start conversation");
    } finally {
      setMessagingId(null);
    }
  };

  const load = async () => {
    try {
      const [mine, owner] = await Promise.all([
        bookingService.myBookings(),
        bookingService.ownerBookings(),
      ]);
      setMyRentals(mine.data.data);
      setRequests(owner.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not load your bookings");
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const runAction = async (fn: () => Promise<unknown>, successMessage: string) => {
    try {
      await fn();
      toast.success(successMessage);
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <DashboardLayout crumb="My Rentals">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary-900">My Rentals</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Track bookings you've made and requests for equipment you own.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-headline text-sm font-semibold text-primary-900">My Rentals</h2>
        {loading ? (
          <SkeletonList />
        ) : myRentals.length === 0 ? (
          <EmptyState message="No rentals yet — browse equipment to get started." />
        ) : (
          <div className="space-y-3">
            {myRentals.map((booking) => (
              <BookingRow key={booking._id} booking={booking}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={messagingId === booking._id}
                  onClick={() => messageAbout(booking, booking.owner._id)}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Message
                </Button>
                {booking.bookingStatus === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      runAction(() => bookingService.cancel(booking._id), "Booking cancelled")
                    }
                  >
                    Cancel
                  </Button>
                )}
                {booking.bookingStatus === "completed" &&
                  (reviewedIds.has(booking._id) ? (
                    <Badge tone="success">Reviewed</Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setReviewTarget(booking)}>
                      Leave a Review
                    </Button>
                  ))}
                {(booking.bookingStatus === "active" ||
                  booking.bookingStatus === "completed") && (
                  <Button variant="outline" size="sm" onClick={() => setDisputeTarget(booking)}>
                    Report Dispute
                  </Button>
                )}
              </BookingRow>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-headline text-sm font-semibold text-primary-900">
          Booking Requests
        </h2>
        {loading ? (
          <SkeletonList />
        ) : requests.length === 0 ? (
          <EmptyState message="No booking requests yet — list equipment to start earning." />
        ) : (
          <div className="space-y-3">
            {requests.map((booking) => (
              <BookingRow key={booking._id} booking={booking} showRenter>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={messagingId === booking._id}
                  onClick={() => messageAbout(booking, booking.customer._id)}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Message
                </Button>
                {booking.bookingStatus === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() =>
                        runAction(() => bookingService.accept(booking._id), "Booking accepted")
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        runAction(() => bookingService.reject(booking._id), "Booking rejected")
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}
                {booking.bookingStatus === "accepted" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      runAction(() => bookingService.pickup(booking._id), "Pickup confirmed")
                    }
                  >
                    Mark Picked Up
                  </Button>
                )}
                {booking.bookingStatus === "active" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      runAction(() => bookingService.complete(booking._id), "Booking completed")
                    }
                  >
                    Mark Returned
                  </Button>
                )}
                {booking.bookingStatus === "completed" &&
                  (reviewedIds.has(booking._id) ? (
                    <Badge tone="success">Reviewed</Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setReviewTarget(booking)}>
                      Leave a Review
                    </Button>
                  ))}
                {(booking.bookingStatus === "active" ||
                  booking.bookingStatus === "completed") && (
                  <Button variant="outline" size="sm" onClick={() => setDisputeTarget(booking)}>
                    Report Dispute
                  </Button>
                )}
              </BookingRow>
            ))}
          </div>
        )}
      </section>

      <ReviewModal
        booking={reviewTarget}
        onClose={() => setReviewTarget(null)}
        onSubmitted={(bookingId) => {
          setReviewedIds((prev) => new Set(prev).add(bookingId));
          setReviewTarget(null);
        }}
      />

      <DisputeModal
        booking={disputeTarget}
        onClose={() => setDisputeTarget(null)}
        onSubmitted={() => {
          setDisputeTarget(null);
          load();
        }}
      />
    </DashboardLayout>
  );
}

function ReviewModal({
  booking,
  onClose,
  onSubmitted,
}: {
  booking: Booking | null;
  onClose: () => void;
  onSubmitted: (bookingId: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!booking) return;
    try {
      setSubmitting(true);
      await reviewService.create({ bookingId: booking._id, rating, comment });
      toast.success("Review submitted");
      onSubmitted(booking._id);
      setRating(5);
      setComment("");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={!!booking} onClose={onClose} title="Leave a Review">
      <div className="space-y-4">
        <p className="text-sm text-neutral-500">{booking?.equipment?.title}</p>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)}>
              <Star
                className={`h-6 w-6 ${
                  n <= rating ? "fill-secondary-500 text-secondary-500" : "text-neutral-300"
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
        />

        <Button className="w-full" onClick={submit} disabled={submitting || comment.trim().length === 0}>
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </Modal>
  );
}

const DISPUTE_REASON_LABEL: Record<DisputeReason, string> = {
  damaged_equipment: "Damaged equipment",
  missing_equipment: "Missing equipment",
  other: "Other",
};

function DisputeModal({
  booking,
  onClose,
  onSubmitted,
}: {
  booking: Booking | null;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [reason, setReason] = useState<DisputeReason>("damaged_equipment");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setReason("damaged_equipment");
    setDescription("");
    setFiles([]);
  };

  const submit = async () => {
    if (!booking) return;
    try {
      setSubmitting(true);
      let evidence: string[] = [];
      if (files.length > 0) {
        const { data } = await uploadService.uploadMultiple(files);
        evidence = data.data.images;
      }
      await disputeService.file({
        bookingId: booking._id,
        reason,
        description,
        evidence,
      });
      toast.success("Dispute filed");
      reset();
      onSubmitted();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not file dispute");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={!!booking}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Report a Dispute"
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-500">{booking?.equipment?.title}</p>

        <label className="flex flex-col gap-1.5">
          <span className="font-label text-xs font-semibold text-primary-700">Reason</span>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as DisputeReason)}
            className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
          >
            {Object.entries(DISPUTE_REASON_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <textarea
          rows={4}
          placeholder="Describe what happened..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
        />

        <label className="flex flex-col gap-1.5">
          <span className="font-label text-xs font-semibold text-primary-700">
            Evidence photos (optional)
          </span>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="text-xs"
          />
        </label>

        <Button
          className="w-full"
          onClick={submit}
          disabled={submitting || description.trim().length === 0}
        >
          {submitting ? "Submitting..." : "Submit Dispute"}
        </Button>
      </div>
    </Modal>
  );
}

function BookingRow({
  booking,
  showRenter,
  children,
}: {
  booking: Booking;
  showRenter?: boolean;
  children?: React.ReactNode;
}) {
  const thumbnail = resolveMediaUrl(booking.equipment?.images?.[0]);

  return (
    <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-primary-900">
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-headline text-sm font-semibold text-primary-900">
            {booking.equipment?.title ?? "Equipment"}
          </p>
          <Badge tone={STATUS_TONE[booking.bookingStatus]}>
            {STATUS_LABEL[booking.bookingStatus]}
          </Badge>
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {format(new Date(booking.startDate), "MMM d")} –{" "}
          {format(new Date(booking.endDate), "MMM d, yyyy")}
          {showRenter && booking.customer?.fullName && ` · ${booking.customer.fullName}`}
        </p>
        <p className="mt-1 text-xs font-semibold text-primary-900">Rs {booking.totalAmount} total</p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">{children}</div>
    </Card>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="card h-20 animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <Card className="py-8 text-center text-sm text-neutral-500">{message}</Card>;
}

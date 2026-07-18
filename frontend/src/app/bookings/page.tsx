"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { CalendarDays } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Badge } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import bookingService from "@/services/booking.service";
import { resolveMediaUrl } from "@/utils/format";
import { Booking, BookingStatus } from "@/types/booking.types";

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
  const [myRentals, setMyRentals] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [mine, owner] = await Promise.all([
      bookingService.myBookings(),
      bookingService.ownerBookings(),
    ]);
    setMyRentals(mine.data.data);
    setRequests(owner.data.data);
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
              </BookingRow>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
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
        <p className="mt-1 text-xs font-semibold text-primary-900">${booking.totalAmount} total</p>
      </div>

      <div className="flex shrink-0 gap-2">{children}</div>
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

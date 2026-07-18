"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Star, CalendarX2 } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { Card, Badge, Avatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import equipmentService from "@/services/equipment.service";
import bookingService from "@/services/booking.service";
import { resolveMediaUrl } from "@/utils/format";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BookedDateRange,
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_CONDITION_LABELS,
  Equipment,
} from "@/types/equipment.types";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function EquipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [item, setItem] = useState<Equipment | null>(null);
  const [bookedRanges, setBookedRanges] = useState<BookedDateRange[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    Promise.all([
      equipmentService.getById(params.id),
      equipmentService.getAvailability(params.id),
    ])
      .then(([itemRes, availabilityRes]) => {
        setItem(itemRes.data.data);
        setBookedRanges(availabilityRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-16 text-center text-sm text-neutral-500">Loading...</Container>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <Container className="py-16 text-center text-sm text-neutral-500">
          This listing couldn&apos;t be found.
        </Container>
        <Footer />
      </>
    );
  }

  const images = item.images.map((img) => resolveMediaUrl(img)).filter(Boolean) as string[];

  const isOwner = user?.id === item.owner._id;

  const totalDays =
    startDate && endDate && new Date(endDate) > new Date(startDate)
      ? Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;
  const totalAmount = totalDays > 0 ? totalDays * item.pricePerDay + item.securityDeposit : 0;

  const requestBooking = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      setSubmitting(true);
      await bookingService.create({ equipmentId: item._id, startDate, endDate });
      toast.success("Booking request sent!");
      router.push("/bookings");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not request this booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-card bg-primary-900">
              {images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[activeImage]}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-white/60">
                  No photos yet
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                      i === activeImage ? "border-secondary-500" : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-600">
                    {EQUIPMENT_CATEGORY_LABELS[item.category]}
                  </p>
                  <h1 className="mt-1 font-headline text-2xl font-bold text-primary-900">
                    {item.title}
                  </h1>
                </div>
                {item.averageRating > 0 && (
                  <span className="flex items-center gap-1 text-sm font-medium text-neutral-600">
                    <Star className="h-4 w-4 fill-secondary-500 text-secondary-500" />
                    {item.averageRating.toFixed(1)}
                    <span className="text-neutral-400">({item.totalReviews})</span>
                  </span>
                )}
              </div>

              {item.location && (
                <div className="mt-2 flex items-center gap-1 text-sm text-neutral-500">
                  <MapPin className="h-4 w-4" />
                  {item.location}
                </div>
              )}

              <p className="mt-6 text-sm leading-relaxed text-neutral-600">{item.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                {item.brand && (
                  <div>
                    <p className="text-xs text-neutral-400">Brand</p>
                    <p className="font-medium text-primary-900">{item.brand}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-neutral-400">Condition</p>
                  <p className="font-medium text-primary-900">
                    {EQUIPMENT_CONDITION_LABELS[item.condition]}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Security Deposit</p>
                  <p className="font-medium text-primary-900">${item.securityDeposit}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="flex items-baseline justify-between">
                <span className="font-headline text-3xl font-bold text-primary-900">
                  ${item.pricePerDay}
                  <span className="text-sm font-normal text-neutral-500">/day</span>
                </span>
                <Badge tone={item.available ? "success" : "neutral"}>
                  {item.available ? "Available" : "Unavailable"}
                </Badge>
              </div>

              {isOwner ? (
                <p className="mt-4 rounded-lg bg-neutral-50 px-3 py-2.5 text-xs text-neutral-500">
                  This is your own listing — you can&apos;t book it.
                </p>
              ) : item.available ? (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Start date"
                      type="date"
                      min={todayIso()}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                      label="End date"
                      type="date"
                      min={startDate || todayIso()}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  {totalDays > 0 && (
                    <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                      <span>
                        {totalDays} day{totalDays > 1 ? "s" : ""} · ${item.pricePerDay}/day + $
                        {item.securityDeposit} deposit
                      </span>
                      <span className="font-semibold text-primary-900">${totalAmount}</span>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    disabled={submitting || totalDays === 0}
                    onClick={requestBooking}
                  >
                    {submitting ? "Sending..." : "Request to Book"}
                  </Button>
                </div>
              ) : (
                <Button className="mt-4 w-full" disabled>
                  Unavailable
                </Button>
              )}
            </Card>

            <Card>
              <h2 className="font-headline text-sm font-semibold text-primary-900">Owner</h2>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={item.owner.fullName} size={40} />
                <div>
                  <p className="text-sm font-medium text-primary-900">{item.owner.fullName}</p>
                  <Badge tone="trust">Trust {item.owner.trustScore}/100</Badge>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-900">
                <CalendarX2 className="h-4 w-4" />
                Availability
              </div>
              {bookedRanges.length === 0 ? (
                <p className="mt-2 text-sm text-neutral-500">
                  No bookings yet — fully open for any dates.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {bookedRanges.map((range, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-600"
                    >
                      <span>
                        {format(new Date(range.startDate), "MMM d")} –{" "}
                        {format(new Date(range.endDate), "MMM d")}
                      </span>
                      <Badge tone="warning">Booked</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}

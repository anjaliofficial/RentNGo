"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  MapPin,
  Star,
  CalendarX2,
  ShieldCheck,
  MailCheck,
  KeyRound,
  MessageCircle,
  Trash2,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { Card, Badge, Avatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import equipmentService, { toEquipmentCardData } from "@/services/equipment.service";
import bookingService from "@/services/booking.service";
import userService from "@/services/user.service";
import reviewService from "@/services/review.service";
import chatService from "@/services/chat.service";
import feedbackService from "@/services/feedback.service";
import { resolveMediaUrl } from "@/utils/format";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BookedDateRange,
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_CONDITION_LABELS,
  Equipment,
} from "@/types/equipment.types";
import { PublicProfile } from "@/types/user.types";
import { Review } from "@/types/review.types";
import { EquipmentFeedback } from "@/types/feedback.types";

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function EquipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [item, setItem] = useState<Equipment | null>(null);
  const [bookedRanges, setBookedRanges] = useState<BookedDateRange[]>([]);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarItems, setSimilarItems] = useState<Equipment[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [contacting, setContacting] = useState(false);
  const [feedbackList, setFeedbackList] = useState<EquipmentFeedback[]>([]);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

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

  useEffect(() => {
    if (!item) return;
    userService
      .getPublicProfile(item.owner._id)
      .then(({ data }) => setProfile(data.data))
      .catch(() => undefined);
    reviewService
      .getForUser(item.owner._id)
      .then(({ data }) => setReviews(data.data))
      .catch(() => undefined);
    feedbackService
      .getForEquipment(item._id)
      .then(({ data }) => setFeedbackList(data.data))
      .catch(() => undefined);
    equipmentService
      .search({ category: item.category, limit: 5 })
      .then(({ data }) => setSimilarItems(data.data.data.filter((e: Equipment) => e._id !== item._id)))
      .catch(() => undefined);
  }, [item]);

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

  const contactOwner = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      setContacting(true);
      const { data } = await chatService.start({
        recipientId: item.owner._id,
        equipmentId: item._id,
      });
      router.push(`/dashboard/messages/${data.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not start conversation");
    } finally {
      setContacting(false);
    }
  };

  const myFeedback = feedbackList.find((f) => f.user._id === user?.id);

  const submitFeedback = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!feedbackComment.trim()) {
      toast.error("Add a comment before submitting");
      return;
    }
    try {
      setSubmittingFeedback(true);
      const { data } = await feedbackService.add(item._id, {
        rating: feedbackRating,
        comment: feedbackComment.trim(),
      });
      setFeedbackList((prev) => {
        const rest = prev.filter((f) => f._id !== data.data._id);
        return [{ ...data.data, user: myFeedback?.user ?? { _id: user.id, fullName: user.fullName, avatar: user.avatar } }, ...rest];
      });
      setFeedbackComment("");
      toast.success(myFeedback ? "Feedback updated" : "Feedback submitted");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const deleteFeedback = async (feedbackId: string) => {
    try {
      await feedbackService.remove(item._id, feedbackId);
      setFeedbackList((prev) => prev.filter((f) => f._id !== feedbackId));
      toast.success("Feedback removed");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not remove feedback");
    }
  };

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
            <div className="group relative aspect-[4/3] overflow-hidden rounded-card bg-white">
              {images.length > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="flex h-full w-full cursor-zoom-in items-center justify-center p-6"
                    aria-label="View full image"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[activeImage]}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </button>
                  <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-primary-900/70 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Maximize2 className="h-3.5 w-3.5" />
                    View full image
                  </span>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
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
                    className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border-2 bg-white p-1 ${
                      i === activeImage ? "border-secondary-500" : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-contain" />
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
                  <p className="font-medium text-primary-900">Rs {item.securityDeposit}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="flex items-baseline justify-between">
                <span className="font-headline text-3xl font-bold text-primary-900">
                  Rs {item.pricePerDay}
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
                        {totalDays} day{totalDays > 1 ? "s" : ""} · Rs {item.pricePerDay}/day + Rs{" "}
                        {item.securityDeposit} deposit
                      </span>
                      <span className="font-semibold text-primary-900">Rs {totalAmount}</span>
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
              <Link href={`/profile/${item.owner._id}`} className="mt-3 flex items-center gap-3">
                <Avatar name={item.owner.fullName} src={resolveMediaUrl(item.owner.avatar)} size={44} />
                <div>
                  <p className="text-sm font-medium text-primary-900 hover:underline">
                    {item.owner.fullName}
                  </p>
                  <Badge tone="trust">Trust {item.owner.trustScore}/100</Badge>
                </div>
              </Link>

              {profile && (
                <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-600">
                  <p>
                    Member since {format(new Date(profile.createdAt), "MMM yyyy")} ·{" "}
                    {profile.completedRentals} rental{profile.completedRentals === 1 ? "" : "s"} completed
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.emailVerified && (
                      <span className="flex items-center gap-1 rounded-full bg-tertiary-50 px-2 py-1 text-[11px] font-semibold text-tertiary-700">
                        <MailCheck className="h-3 w-3" /> Email Verified
                      </span>
                    )}
                    {profile.mfaEnabled && (
                      <span className="flex items-center gap-1 rounded-full bg-tertiary-50 px-2 py-1 text-[11px] font-semibold text-tertiary-700">
                        <KeyRound className="h-3 w-3" /> 2FA Enabled
                      </span>
                    )}
                    {profile.verificationStatus === "approved" && (
                      <span className="flex items-center gap-1 rounded-full bg-tertiary-50 px-2 py-1 text-[11px] font-semibold text-tertiary-700">
                        <ShieldCheck className="h-3 w-3" /> ID Verified
                      </span>
                    )}
                  </div>
                </div>
              )}

              {!isOwner && (
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  disabled={contacting}
                  onClick={contactOwner}
                >
                  <MessageCircle className="h-4 w-4" />
                  {contacting ? "Starting chat..." : "Contact Owner"}
                </Button>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-sm font-semibold text-primary-900">
                  Owner Reviews
                </h2>
                {reviews.length > 0 && (
                  <span className="flex items-center gap-1 text-sm font-medium text-neutral-600">
                    <Star className="h-4 w-4 fill-secondary-500 text-secondary-500" />
                    {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                    <span className="text-neutral-400">({reviews.length})</span>
                  </span>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="mt-2 text-sm text-neutral-500">No reviews yet.</p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {reviews.slice(0, 5).map((review) => (
                    <li key={review._id} className="border-t border-neutral-100 pt-3 first:border-0 first:pt-0">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={review.reviewer.fullName}
                          src={resolveMediaUrl(review.reviewer.avatar)}
                          size={28}
                        />
                        <span className="text-sm font-medium text-primary-900">
                          {review.reviewer.fullName}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                          <Star className="h-3 w-3 fill-secondary-500 text-secondary-500" />
                          {review.rating}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-neutral-600">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-sm font-semibold text-primary-900">
                  Listing Feedback
                </h2>
                {item.totalReviews > 0 && (
                  <span className="flex items-center gap-1 text-sm font-medium text-neutral-600">
                    <Star className="h-4 w-4 fill-secondary-500 text-secondary-500" />
                    {item.averageRating.toFixed(1)}
                    <span className="text-neutral-400">({item.totalReviews})</span>
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Any member of the community can rate and comment on this listing.
              </p>

              {!isOwner && (
                <div className="mt-4 space-y-2 rounded-lg bg-neutral-50 p-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setFeedbackRating(n)}
                        aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            n <= feedbackRating
                              ? "fill-secondary-500 text-secondary-500"
                              : "text-neutral-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    placeholder={
                      myFeedback ? "Update your feedback..." : "Share your thoughts on this listing..."
                    }
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-secondary-500 focus:outline-none"
                  />
                  <Button size="sm" disabled={submittingFeedback} onClick={submitFeedback}>
                    {submittingFeedback
                      ? "Submitting..."
                      : myFeedback
                      ? "Update Feedback"
                      : "Submit Feedback"}
                  </Button>
                </div>
              )}

              {feedbackList.length === 0 ? (
                <p className="mt-4 text-sm text-neutral-500">
                  No feedback yet — be the first to share your thoughts.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {feedbackList.map((feedback) => (
                    <li
                      key={feedback._id}
                      className="border-t border-neutral-100 pt-3 first:border-0 first:pt-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={feedback.user.fullName}
                            src={resolveMediaUrl(feedback.user.avatar)}
                            size={28}
                          />
                          <span className="text-sm font-medium text-primary-900">
                            {feedback.user.fullName}
                          </span>
                          <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                            <Star className="h-3 w-3 fill-secondary-500 text-secondary-500" />
                            {feedback.rating}
                          </span>
                        </div>
                        {feedback.user._id === user?.id && (
                          <button
                            aria-label="Delete feedback"
                            onClick={() => deleteFeedback(feedback._id)}
                            className="text-neutral-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-neutral-600">{feedback.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
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

        {similarItems.length > 0 && (
          <div className="mt-14">
            <h2 className="font-headline text-xl font-bold text-primary-900">Similar Items</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {similarItems.slice(0, 4).map((similar) => (
                <EquipmentCard key={similar._id} item={toEquipmentCardData(similar)} />
              ))}
            </div>
          </div>
        )}
      </Container>

      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            aria-label="Close"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1));
                }}
                className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1));
                }}
                className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeImage]}
            alt={item.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain"
          />

          {images.length > 1 && (
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              {activeImage + 1} / {images.length}
            </span>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}

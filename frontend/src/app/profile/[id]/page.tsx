"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { KeyRound, MailCheck, MessageCircle, ShieldCheck, Star } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { Card, Avatar } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import TrustScoreRing from "@/components/dashboard/TrustScoreRing";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import userService from "@/services/user.service";
import reviewService from "@/services/review.service";
import equipmentService, { toEquipmentCardData } from "@/services/equipment.service";
import chatService from "@/services/chat.service";
import { resolveMediaUrl } from "@/utils/format";
import { useAuth } from "@/components/auth/AuthProvider";
import { PublicProfile } from "@/types/user.types";
import { Review } from "@/types/review.types";
import { Equipment } from "@/types/equipment.types";

export default function ListerProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listings, setListings] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);

  const profileId = params.id;

  useEffect(() => {
    if (!profileId) return;
    Promise.all([
      userService.getPublicProfile(profileId),
      reviewService.getForUser(profileId),
      equipmentService.search({ owner: profileId, limit: 12 }),
    ])
      .then(([profileRes, reviewsRes, listingsRes]) => {
        setProfile(profileRes.data.data);
        setReviews(reviewsRes.data.data);
        setListings(listingsRes.data.data.data);
      })
      .finally(() => setLoading(false));
  }, [profileId]);

  const contactLister = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      setContacting(true);
      const { data } = await chatService.start({ recipientId: profileId });
      router.push(`/dashboard/messages/${data.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not start conversation");
    } finally {
      setContacting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-16 text-center text-sm text-neutral-500">Loading...</Container>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <Container className="py-16 text-center text-sm text-neutral-500">
          This profile couldn&apos;t be found.
        </Container>
        <Footer />
      </>
    );
  }

  const isSelf = user?.id === profile._id;
  const avgReviewRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <>
      <Navbar />
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-6">
            <Card className="text-center">
              <Avatar
                name={profile.fullName}
                src={resolveMediaUrl(profile.avatar)}
                size={72}
              />
              <h1 className="mt-3 font-headline text-xl font-bold text-primary-900">
                {profile.fullName}
              </h1>
              <p className="mt-1 text-xs text-neutral-500">
                Member since {format(new Date(profile.createdAt), "MMM yyyy")}
              </p>

              <div className="mt-5 flex justify-center">
                <TrustScoreRing score={profile.trustScore} size={110} />
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
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

              <p className="mt-4 text-sm text-neutral-600">
                {profile.completedRentals} rental{profile.completedRentals === 1 ? "" : "s"}{" "}
                completed
                {reviews.length > 0 && (
                  <>
                    {" "}
                    · {avgReviewRating.toFixed(1)} avg rating ({reviews.length})
                  </>
                )}
              </p>

              {!isSelf && (
                <Button
                  className="mt-5 w-full"
                  variant="outline"
                  disabled={contacting}
                  onClick={contactLister}
                >
                  <MessageCircle className="h-4 w-4" />
                  {contacting ? "Starting chat..." : "Message"}
                </Button>
              )}
            </Card>

            <Card>
              <h2 className="font-headline text-sm font-semibold text-primary-900">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="mt-2 text-sm text-neutral-500">No reviews yet.</p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {reviews.slice(0, 8).map((review) => (
                    <li
                      key={review._id}
                      className="border-t border-neutral-100 pt-3 first:border-0 first:pt-0"
                    >
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
          </div>

          <div>
            <h2 className="font-headline text-lg font-bold text-primary-900">
              {isSelf ? "Your Listings" : `${profile.fullName}'s Listings`}
            </h2>
            {listings.length === 0 ? (
              <Card className="mt-4 py-10 text-center text-sm text-neutral-500">
                No active listings yet.
              </Card>
            ) : (
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                {listings.map((item) => (
                  <EquipmentCard key={item._id} item={toEquipmentCardData(item)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}

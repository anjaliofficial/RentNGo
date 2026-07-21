import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";

export interface EquipmentCardData {
  id: string;
  title: string;
  category: string;
  dailyRate: number;
  imageColor: string;
  image?: string;
  ownerTrustScore: number;
  location?: string;
  rating?: number;
}

export default function EquipmentCard({ item }: { item: EquipmentCardData }) {
  return (
    <Link
      href={`/browse/${item.id}`}
      className="card group flex flex-col overflow-hidden !p-0 transition-shadow hover:shadow-lg"
    >
      {item.image ? (
        <div className="flex h-40 items-center justify-center overflow-hidden bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-contain transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className="flex h-40 items-center justify-center"
          style={{ backgroundColor: item.imageColor }}
        >
          <span className="font-label text-xs font-medium uppercase tracking-wide text-white/80">
            {item.category}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-headline text-sm font-semibold leading-snug text-primary-900">
            {item.title}
          </h3>
          <span className="badge-trust shrink-0">{item.ownerTrustScore}</span>
        </div>

        {item.location && (
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <MapPin className="h-3.5 w-3.5" />
            {item.location}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-headline text-base font-bold text-primary-900">
            Rs {item.dailyRate}
            <span className="text-xs font-normal text-neutral-500">/day</span>
          </span>
          {item.rating && (
            <span className="flex items-center gap-1 text-xs font-medium text-neutral-600">
              <Star className="h-3.5 w-3.5 fill-secondary-500 text-secondary-500" />
              {item.rating.toFixed(1)}
            </span>
          )}
        </div>

        <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-secondary-600 group-hover:text-secondary-700">
          View Details <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

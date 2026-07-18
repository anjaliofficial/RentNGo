import Link from "next/link";
import { Star, MapPin } from "lucide-react";

export interface EquipmentCardData {
  id: string;
  title: string;
  category: string;
  dailyRate: number;
  imageColor: string;
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
      <div
        className="flex h-40 items-center justify-center"
        style={{ backgroundColor: item.imageColor }}
      >
        <span className="font-label text-xs font-medium uppercase tracking-wide text-white/80">
          {item.category}
        </span>
      </div>
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
            ${item.dailyRate}
            <span className="text-xs font-normal text-neutral-500">/day</span>
          </span>
          {item.rating && (
            <span className="flex items-center gap-1 text-xs font-medium text-neutral-600">
              <Star className="h-3.5 w-3.5 fill-secondary-500 text-secondary-500" />
              {item.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

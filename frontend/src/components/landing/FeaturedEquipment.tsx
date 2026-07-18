import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import Container from "../layout/Container";

interface FeaturedItem {
  id: string;
  title: string;
  category: string;
  dailyRate: number;
  trustScore: number;
  imageColor: string;
  co2Saved: number;
}

const FEATURED: FeaturedItem[] = [
  { id: "1", title: "RED V-Raptor 8K", category: "Cinema · 8K RAW", dailyRate: 450, trustScore: 99, imageColor: "#0F172A", co2Saved: 2.4 },
  { id: "2", title: "Sony GM Prime Kit", category: "Optics · F/1.2", dailyRate: 120, trustScore: 97, imageColor: "#0EA5E9", co2Saved: 0.8 },
  { id: "3", title: "DJI Matrice 300 RTK", category: "Survey · IP55", dailyRate: 380, trustScore: 100, imageColor: "#14B8A6", co2Saved: 1.9 },
  { id: "4", title: "Bosch GRL 600 Rotary", category: "Tools · Laser", dailyRate: 65, trustScore: 95, imageColor: "#787778", co2Saved: 1.2 },
];

export default function FeaturedEquipment() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex items-end justify-between">
          <div>
            <span className="eyebrow">Trust-Based Search</span>
            <h2 className="mt-3 font-headline text-3xl font-bold text-primary-900">
              Trending Equipment
            </h2>
          </div>
          <Link
            href="/browse"
            className="hidden items-center gap-1 text-sm font-semibold text-secondary-600 hover:text-secondary-700 md:flex"
          >
            View all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((item) => (
            <Link
              href={`/equipment/${item.id}`}
              key={item.id}
              className="group overflow-hidden rounded-card border border-neutral-100 bg-white shadow-card transition-shadow hover:shadow-lg"
            >
              <div
                className="relative flex h-36 items-end p-3"
                style={{ backgroundColor: item.imageColor }}
              >
                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 font-label text-[10px] font-bold text-tertiary-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary-500" /> TRUST {item.trustScore}
                </span>
                <span className="font-label text-[10px] uppercase tracking-wide text-white/80">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-headline text-sm font-semibold text-primary-900">
                  {item.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-headline text-base font-bold text-primary-900">
                    ${item.dailyRate}
                    <span className="text-xs font-normal text-neutral-500"> /day</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-tertiary-600">
                    <Leaf className="h-3 w-3" /> {item.co2Saved}kg
                  </span>
                </div>
                <button className="btn-primary mt-3 w-full !py-2 text-xs">Rent</button>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

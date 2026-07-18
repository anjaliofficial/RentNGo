"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "../layout/Container";
import EquipmentCard from "../equipment/EquipmentCard";
import equipmentService, { toEquipmentCardData } from "@/services/equipment.service";
import { Equipment } from "@/types/equipment.types";

export default function FeaturedEquipment() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    equipmentService
      .search({ limit: 4, sort: "rating" })
      .then(({ data }) => setItems(data.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

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
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse !p-0" />
              ))
            : items.map((item) => (
                <EquipmentCard key={item._id} item={toEquipmentCardData(item)} />
              ))}
        </div>
      </Container>
    </section>
  );
}

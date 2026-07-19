"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import EquipmentCard from "@/components/equipment/EquipmentCard";
import equipmentService, { toEquipmentCardData } from "@/services/equipment.service";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CATEGORY_LABELS,
  Equipment,
} from "@/types/equipment.types";

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExplorePageContent />
    </Suspense>
  );
}

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [items, setItems] = useState<Equipment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<"latest" | "price" | "rating">("latest");

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const runSearch = async (targetPage = 1, sortOverride?: typeof sort) => {
    try {
      setLoading(true);
      const { data } = await equipmentService.search({
        search: search || undefined,
        category: categories[0] || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sortOverride ?? sort,
        page: targetPage,
        limit: 12,
      });
      const result = data.data;
      const others = result.data.filter((item: Equipment) => item.owner._id !== user?.id);
      setItems(others);
      setTotal(result.total);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const onSubmitFilters = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(1);
  };

  return (
    <DashboardLayout crumb="Explore">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary-900">
            {loading ? "Searching..." : `Explore ${total} listings from other renters`}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Browse equipment listed by the RentNGo community — view details, contact the
            lister, or request a booking.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-600">
          Sort by
          <select
            value={sort}
            onChange={(e) => {
              const next = e.target.value as typeof sort;
              setSort(next);
              runSearch(1, next);
            }}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-secondary-500"
          >
            <option value="latest">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="rating">Top Rated</option>
          </select>
        </label>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <form onSubmit={onSubmitFilters} className="card h-fit space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary-900">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </div>
            <Input
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-2 font-label text-xs font-semibold uppercase tracking-wide text-primary-700">
              Category
            </p>
            <div className="space-y-1.5">
              {EQUIPMENT_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-sm text-neutral-600"
                >
                  <input
                    type="checkbox"
                    className="accent-secondary-500"
                    checked={categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  {EQUIPMENT_CATEGORY_LABELS[category]}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-label text-xs font-semibold uppercase tracking-wide text-primary-700">
              Price Range (per day)
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Rs 0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-neutral-400">—</span>
              <Input
                type="number"
                placeholder="Rs 500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Search className="h-4 w-4" />
            Apply Filters
          </Button>
        </form>

        <div>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse !p-0" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="card py-16 text-center text-sm text-neutral-500">
              No other listings match your filters yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <EquipmentCard key={item._id} item={toEquipmentCardData(item)} />
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Pagination page={page} totalPages={totalPages} onChange={runSearch} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

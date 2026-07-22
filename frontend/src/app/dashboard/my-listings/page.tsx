"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, Star, CalendarCheck, Pencil, Trash2, Plus } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, Badge, Modal } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import equipmentService from "@/services/equipment.service";
import { resolveMediaUrl } from "@/utils/format";
import { EQUIPMENT_CATEGORY_LABELS, Equipment } from "@/types/equipment.types";

export default function MyListingsPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await equipmentService.myItems();
    setItems(data.data);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const toggleAvailable = async (item: Equipment) => {
    try {
      setBusyId(item._id);
      await equipmentService.update(item._id, { available: !item.available });
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not update listing");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setBusyId(deleteTarget._id);
      await equipmentService.remove(deleteTarget._id);
      toast.success("Listing deleted");
      setDeleteTarget(null);
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not delete listing");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout crumb="My Listings">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary-900">My Listings</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage the equipment you've listed for rent.
          </p>
        </div>
        <Link href="/dashboard/list-equipment">
          <Button>
            <Plus className="h-4 w-4" />
            List New Equipment
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-44 animate-pulse !p-0" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="py-12 text-center text-sm text-neutral-500">
          You haven&apos;t listed any equipment yet.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const thumbnail = resolveMediaUrl(item.images?.[0]);
            return (
              <Card key={item._id} className="flex flex-col overflow-hidden !p-0">
                <div className="flex h-24 items-center justify-center bg-white">
                  {thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnail} alt="" className="h-full w-full object-contain" />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary-600">
                        {EQUIPMENT_CATEGORY_LABELS[item.category]}
                      </p>
                      <h3 className="font-headline text-xs font-semibold text-primary-900">
                        {item.title}
                      </h3>
                    </div>
                    <Badge tone={item.available ? "success" : "neutral"}>
                      {item.available ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <p className="font-headline text-sm font-bold text-primary-900">
                    Rs {item.pricePerDay}
                    <span className="text-[10px] font-normal text-neutral-500">/day</span>
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {item.views ?? 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarCheck className="h-3 w-3" /> {item.totalBookings} bookings
                    </span>
                    {item.averageRating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-secondary-500 text-secondary-500" />
                        {item.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center gap-1.5 pt-2">
                    <Link href={`/dashboard/my-listings/${item._id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busyId === item._id}
                      onClick={() => toggleAvailable(item)}
                    >
                      {item.available ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={busyId === item._id}
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this listing?"
      >
        <p className="text-sm text-neutral-600">
          This will permanently remove &ldquo;{deleteTarget?.title}&rdquo; from the marketplace.
          This can&apos;t be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={busyId === deleteTarget?._id}>
            Delete Listing
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, X } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import equipmentService from "@/services/equipment.service";
import uploadService from "@/services/upload.service";
import { resolveMediaUrl } from "@/utils/format";
import { equipmentDetailsSchema, equipmentPricingSchema } from "@/lib/validators";
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_CONDITIONS,
  EQUIPMENT_CONDITION_LABELS,
} from "@/types/equipment.types";

const equipmentEditSchema = equipmentDetailsSchema.merge(equipmentPricingSchema);
type EquipmentEditSchema = import("zod").infer<typeof equipmentEditSchema>;

interface PendingPhoto {
  id: string;
  previewUrl: string;
  uploadedPath?: string;
  status: "uploading" | "done" | "error";
}

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [available, setAvailable] = useState(true);
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);

  const uploading = photos.some((p) => p.status === "uploading");
  const images = photos.filter((p) => p.status === "done" && p.uploadedPath).map((p) => p.uploadedPath!);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EquipmentEditSchema>({ resolver: zodResolver(equipmentEditSchema) });

  useEffect(() => {
    if (!params.id) return;
    equipmentService
      .getById(params.id)
      .then(({ data }) => {
        const item = data.data;
        reset({
          title: item.title,
          category: item.category,
          brand: item.brand ?? "",
          condition: item.condition,
          description: item.description,
          pricePerDay: item.pricePerDay,
          securityDeposit: item.securityDeposit,
          location: item.location,
        });
        setAvailable(item.available);
        setPhotos(
          (item.images ?? []).map((path: string) => ({
            id: path,
            previewUrl: resolveMediaUrl(path) ?? "",
            uploadedPath: path,
            status: "done" as const,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [params.id, reset]);

  const onSelectPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    e.target.value = "";

    const pending: PendingPhoto[] = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      previewUrl: URL.createObjectURL(file),
      status: "uploading",
    }));
    setPhotos((prev) => [...prev, ...pending]);

    try {
      const { data } = await uploadService.uploadMultiple(files);
      const uploadedPaths: string[] = data.data.images;
      setPhotos((prev) =>
        prev.map((p) => {
          const pendingIndex = pending.findIndex((pp) => pp.id === p.id);
          return pendingIndex === -1
            ? p
            : { ...p, status: "done", uploadedPath: uploadedPaths[pendingIndex] };
        })
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not upload photos");
      setPhotos((prev) =>
        prev.map((p) => (pending.some((pp) => pp.id === p.id) ? { ...p, status: "error" } : p))
      );
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const onSubmit = async (data: EquipmentEditSchema) => {
    try {
      setSubmitting(true);
      await equipmentService.update(params.id, { ...data, available, images } as any);
      toast.success("Listing updated");
      router.push("/dashboard/my-listings");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not update listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout crumb="Edit Listing">
        <p className="text-sm text-neutral-500">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout crumb="Edit Listing">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary-900">Edit Listing</h1>
        <p className="mt-1 text-sm text-neutral-500">Update your listing's details, pricing, and photos.</p>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Item Name" {...register("title")} error={errors.title?.message} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="font-label text-xs font-semibold text-primary-700">Category</span>
              <select
                {...register("category")}
                className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
              >
                {EQUIPMENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {EQUIPMENT_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-label text-xs font-semibold text-primary-700">Condition</span>
              <select
                {...register("condition")}
                className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
              >
                {EQUIPMENT_CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {EQUIPMENT_CONDITION_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Input label="Brand (optional)" {...register("brand")} />

          <label className="flex flex-col gap-1.5">
            <span className="font-label text-xs font-semibold text-primary-700">Description</span>
            <textarea
              rows={4}
              {...register("description")}
              className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
            />
            {errors.description && (
              <span className="text-xs text-red-500">{errors.description.message}</span>
            )}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Daily Rate (Rs)"
              type="number"
              min={1}
              {...register("pricePerDay", { valueAsNumber: true })}
              error={errors.pricePerDay?.message}
            />
            <Input
              label="Security Deposit (Rs)"
              type="number"
              min={0}
              {...register("securityDeposit", { valueAsNumber: true })}
              error={errors.securityDeposit?.message}
            />
          </div>

          <Input label="Pickup Location" {...register("location")} error={errors.location?.message} />

          <label className="flex items-center gap-3 rounded-lg bg-neutral-50 px-4 py-3">
            <input
              type="checkbox"
              className="accent-secondary-500"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <span className="text-sm font-medium text-primary-900">Available for booking</span>
          </label>

          <div>
            <span className="font-label text-xs font-semibold text-primary-700">Photos</span>
            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
                  {photo.status === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary-900/50">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-200 text-neutral-400 hover:border-secondary-500 hover:text-secondary-600">
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Add photos</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="hidden"
                  onChange={onSelectPhotos}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/my-listings")}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || uploading}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}

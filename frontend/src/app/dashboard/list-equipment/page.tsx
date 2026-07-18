"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Check, ImagePlus, Trash2, X } from "lucide-react";
import clsx from "clsx";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import equipmentService from "@/services/equipment.service";
import uploadService from "@/services/upload.service";
import { resolveMediaUrl } from "@/utils/format";
import {
  equipmentDetailsSchema,
  EquipmentDetailsSchema,
  equipmentPricingSchema,
  EquipmentPricingSchema,
} from "@/lib/validators";
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_CONDITIONS,
  EQUIPMENT_CONDITION_LABELS,
} from "@/types/equipment.types";

const STEPS = ["Details", "Pricing & Deposit", "Availability & Photos"] as const;

export default function ListEquipmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<EquipmentDetailsSchema | null>(null);
  const [pricing, setPricing] = useState<EquipmentPricingSchema | null>(null);
  const [available, setAvailable] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const detailsForm = useForm<EquipmentDetailsSchema>({
    resolver: zodResolver(equipmentDetailsSchema),
    defaultValues: details ?? { title: "", category: "", brand: "", condition: "", description: "" },
  });

  const pricingForm = useForm<EquipmentPricingSchema>({
    resolver: zodResolver(equipmentPricingSchema),
    defaultValues: pricing ?? { pricePerDay: 0, securityDeposit: 0, location: "" },
  });

  const onSubmitDetails = (data: EquipmentDetailsSchema) => {
    setDetails(data);
    setStep(2);
  };

  const onSubmitPricing = (data: EquipmentPricingSchema) => {
    setPricing(data);
    setStep(3);
  };

  const onSelectPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    try {
      setUploading(true);
      const { data } = await uploadService.uploadMultiple(files);
      setImages((prev) => [...prev, ...data.data.images]);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not upload photos");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (path: string) => {
    setImages((prev) => prev.filter((img) => img !== path));
  };

  const finish = async () => {
    if (!details || !pricing) return;
    try {
      setSubmitting(true);
      await equipmentService.create({
        ...details,
        ...pricing,
        available,
        images,
      } as any);
      toast.success("Your equipment is now listed!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Could not create listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout crumb="List Equipment">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary-900">List Your Equipment</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Start earning by sharing your professional gear with a verified community.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {STEPS.map((label, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <div key={label} className="flex items-center gap-2">
              <span
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  done
                    ? "bg-tertiary-500 text-white"
                    : active
                    ? "bg-primary-900 text-white"
                    : "bg-neutral-200 text-neutral-500"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : num}
              </span>
              <span
                className={clsx(
                  "text-xs font-medium",
                  active || done ? "text-primary-900" : "text-neutral-400"
                )}
              >
                {label}
              </span>
              {num < STEPS.length && <span className="mx-2 h-px w-8 bg-neutral-200" />}
            </div>
          );
        })}
      </div>

      <Card className="max-w-2xl">
        {step === 1 && (
          <form onSubmit={detailsForm.handleSubmit(onSubmitDetails)} className="space-y-4">
            <h2 className="font-headline text-sm font-semibold text-primary-900">Step 1: Item Details</h2>

            <Input
              label="Item Name"
              placeholder="e.g. Sony A7R IV Mirrorless Camera"
              {...detailsForm.register("title")}
              error={detailsForm.formState.errors.title?.message}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="font-label text-xs font-semibold text-primary-700">Category</span>
                <select
                  {...detailsForm.register("category")}
                  className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
                >
                  <option value="">Select category</option>
                  {EQUIPMENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {EQUIPMENT_CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
                {detailsForm.formState.errors.category && (
                  <span className="text-xs text-red-500">
                    {detailsForm.formState.errors.category.message}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-label text-xs font-semibold text-primary-700">Condition</span>
                <select
                  {...detailsForm.register("condition")}
                  className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
                >
                  <option value="">Select condition</option>
                  {EQUIPMENT_CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {EQUIPMENT_CONDITION_LABELS[c]}
                    </option>
                  ))}
                </select>
                {detailsForm.formState.errors.condition && (
                  <span className="text-xs text-red-500">
                    {detailsForm.formState.errors.condition.message}
                  </span>
                )}
              </label>
            </div>

            <Input
              label="Brand (optional)"
              placeholder="e.g. Sony, DJI, Canon"
              {...detailsForm.register("brand")}
            />

            <label className="flex flex-col gap-1.5">
              <span className="font-label text-xs font-semibold text-primary-700">Description</span>
              <textarea
                rows={4}
                placeholder="Describe the item, what's included in the rental (batteries, lenses, carry case)..."
                {...detailsForm.register("description")}
                className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:border-secondary-500 focus:outline-none"
              />
              {detailsForm.formState.errors.description && (
                <span className="text-xs text-red-500">
                  {detailsForm.formState.errors.description.message}
                </span>
              )}
            </label>

            <Button type="submit">Continue to Step 2</Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={pricingForm.handleSubmit(onSubmitPricing)} className="space-y-4">
            <h2 className="font-headline text-sm font-semibold text-primary-900">
              Step 2: Pricing & Deposit
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Daily Rate ($)"
                type="number"
                min={1}
                {...pricingForm.register("pricePerDay", { valueAsNumber: true })}
                error={pricingForm.formState.errors.pricePerDay?.message}
              />
              <Input
                label="Security Deposit ($)"
                type="number"
                min={0}
                {...pricingForm.register("securityDeposit", { valueAsNumber: true })}
                error={pricingForm.formState.errors.securityDeposit?.message}
              />
            </div>

            <Input
              label="Pickup Location"
              placeholder="e.g. Downtown Metro, San Francisco"
              {...pricingForm.register("location")}
              error={pricingForm.formState.errors.location?.message}
            />

            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit">Continue to Step 3</Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-headline text-sm font-semibold text-primary-900">
              Step 3: Availability & Photos
            </h2>

            <label className="flex items-center gap-3 rounded-lg bg-neutral-50 px-4 py-3">
              <input
                type="checkbox"
                className="accent-secondary-500"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-primary-900">Available for booking</p>
                <p className="text-xs text-neutral-500">
                  Turn this off if you're not ready to accept requests yet.
                </p>
              </div>
            </label>

            <div>
              <span className="font-label text-xs font-semibold text-primary-700">Photos</span>
              <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((img) => (
                  <div key={img} className="group relative aspect-square overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveMediaUrl(img)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-200 text-neutral-400 hover:border-secondary-500 hover:text-secondary-600">
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-xs">{uploading ? "Uploading..." : "Add photo"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={onSelectPhotos}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={finish} disabled={submitting || uploading}>
                {submitting ? "Publishing..." : "Publish Listing"}
              </Button>
              {images.length === 0 && (
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Trash2 className="h-3.5 w-3.5" /> No photos added yet
                </span>
              )}
            </div>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

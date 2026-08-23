"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input, Label, Textarea } from "@urbandetox/ui";
import { ImageUploadInline } from "@/components/shared/ImageUploadInline";
import type { PackageFormData } from "./use-package-form";

interface LogisticsFieldsProps {
  form: UseFormReturn<PackageFormData>;
}

const TEXT_FIELDS = [
  { name: "pickupPoint", label: "Pickup point", placeholder: "Bangalore" },
  { name: "dropPoint", label: "Drop point", placeholder: "Bangalore" },
  { name: "pickupTime", label: "Pickup time", placeholder: "21:30" },
  { name: "returnTime", label: "Return time", placeholder: "06:00" },
  { name: "transportType", label: "Transport", placeholder: "AC Tempo Traveller" },
  { name: "stayType", label: "Stay type", placeholder: "Nature resort" },
  { name: "roomSharing", label: "Room sharing", placeholder: "Triple sharing" },
  { name: "mealPlan", label: "Meal plan", placeholder: "Breakfast, lunch and dinner" },
] as const;

export function LogisticsFields({ form }: LogisticsFieldsProps) {
  /* eslint-disable react-hooks/incompatible-library */
  const mapImage = form.watch("pickupMapImage");
  /* eslint-enable react-hooks/incompatible-library */

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        Shown on the package page so travellers stop asking these over WhatsApp.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEXT_FIELDS.map((f) => (
          <div key={f.name} className="space-y-1.5">
            <Label className="text-xs font-semibold">{f.label}</Label>
            <Input
              {...form.register(f.name)}
              placeholder={f.placeholder}
              className="h-10 rounded-xl bg-white text-sm"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Pickup point map link</Label>
          <Input
            {...form.register("pickupMapUrl")}
            placeholder="https://maps.google.com/..."
            className="h-10 rounded-xl bg-white text-sm"
          />
          <p className="text-[11px] text-muted-foreground">
            Opens the pin directly in the traveller&apos;s maps app.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Pickup point map image</Label>
          <ImageUploadInline
            value={mapImage}
            onChange={(url) => form.setValue("pickupMapImage", url, { shouldValidate: true })}
            folder="packages/gallery"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Cancellation policy note</Label>
        <Textarea
          {...form.register("cancellationPolicy")}
          rows={2}
          placeholder="See the cancellation and refund policy at /terms"
          className="rounded-xl bg-white text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">SEO title</Label>
          <Input {...form.register("seoTitle")} className="h-10 rounded-xl bg-white text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">SEO description</Label>
          <Textarea
            {...form.register("seoDescription")}
            rows={2}
            className="rounded-xl bg-white text-sm"
          />
        </div>
      </div>
    </div>
  );
}

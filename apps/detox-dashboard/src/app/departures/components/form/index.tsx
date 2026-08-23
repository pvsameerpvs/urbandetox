"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@urbandetox/ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FormSection } from "@/components/forms/FormSection";
import { FormActions } from "@/components/forms/FormActions";
import type { Departure, Package, Destination } from "@urbandetox/utils";
import { Tag, Clock } from "lucide-react";
import { PackageSelectField } from "./PackageSelectField";
import { StatusFields } from "./StatusFields";
import { ImageField } from "./ImageField";
import { DepartureFormData, departureFormSchema } from "./schema";

interface DepartureFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Departure>;
  onSubmit: (data: DepartureFormData) => void;
  submitLabel: string;
  cancelHref: string;
  packages: Package[];
  destinations: Destination[];
}

export { type DepartureFormData };

export function DepartureForm({
  mode,
  initialData,
  onSubmit,
  submitLabel,
  cancelHref,
  packages,
  destinations,
}: DepartureFormProps) {
  const form = useForm<DepartureFormData>({
    resolver: zodResolver(departureFormSchema),
    defaultValues: {
      code: initialData?.code ?? undefined,
      packageSlug: initialData?.packageSlug ?? undefined,
      destinationSlug: initialData?.destinationSlug ?? undefined,
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
      price: initialData?.price ?? 0,
      /**
       * Not 0. Every price display resolves `offerPrice ?? price`, and 0 is not
       * nullish, so a new departure defaulting to 0 made the trip show as
       * free everywhere. undefined means "no offer price".
       */
      offerPrice: initialData?.offerPrice ?? undefined,
      seatsTotal: initialData?.seatsTotal ?? 10,
      seatsLeft: initialData?.seatsLeft ?? 10,
      status: (initialData?.status as DepartureFormData["status"]) || "open",
      tripStatus: (initialData?.tripStatus as DepartureFormData["tripStatus"]) ?? undefined,
      image: initialData?.image ?? undefined,
      startTime: initialData?.startTime ?? undefined,
      endTime: initialData?.endTime ?? undefined,
    },
  });

  const selectedPackageSlug = useWatch({
    control: form.control,
    name: "packageSlug",
  });
  const selectedPkg = packages.find((p) => p.slug === selectedPackageSlug);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormSection>
          <PackageSelectField
            control={form.control}
            packages={packages}
            destinations={destinations}
            setValue={form.setValue}
            mode={mode}
          />

          {mode === "edit" && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-brand" /> Departure Code
                  </FormLabel>
                  <FormControl>
                    <Input readOnly className="h-11 rounded-xl bg-muted/40 font-mono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {mode === "create" && selectedPkg && (
            <AutoCodeNotice
              destination={
                destinations.find((d) => d.slug === selectedPkg.destinationSlug)
              }
            />
          )}

          <ImageField control={form.control} />

          <DateRangeFields control={form.control} />

          <TimeRangeFields control={form.control} />

          <PricingFields control={form.control} />

          <SeatsFields control={form.control} />

          <StatusFields control={form.control} />

          <FormActions submitLabel={submitLabel} cancelHref={cancelHref} />
        </FormSection>
      </form>
    </FormProvider>
  );
}

function AutoCodeNotice({ destination }: { destination: import("@urbandetox/utils").Destination | undefined }) {
  const prefix = destination?.codePrefix || destination?.name.slice(0, 5).toUpperCase() || "DEST";
  return (
    <div className="rounded-xl border border-brand/20 bg-brand/[0.03] p-4">
      <p className="text-xs text-muted-foreground">
        Departure code will be auto-generated based on destination
        <span className="block mt-1 font-medium text-brand">
          e.g. {prefix}-001
        </span>
      </p>
    </div>
  );
}

function DateRangeFields({ control }: { control: import("react-hook-form").Control<DepartureFormData> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <FormField
        control={control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <Input type="date" className="h-11 rounded-xl" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="endDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date</FormLabel>
            <FormControl>
              <Input type="date" className="h-11 rounded-xl" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function TimeRangeFields({ control }: { control: import("react-hook-form").Control<DepartureFormData> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <FormField
        control={control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand" /> Start Time
            </FormLabel>
            <FormControl>
              <Input type="time" className="h-11 rounded-xl" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="endTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand" /> End Time
            </FormLabel>
            <FormControl>
              <Input type="time" className="h-11 rounded-xl" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function PricingFields({ control }: { control: import("react-hook-form").Control<DepartureFormData> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <NumberField control={control} name="price" label="Price (₹)" min={0} />
      <NumberField control={control} name="offerPrice" label="Offer Price (₹)" min={1} optional />
    </div>
  );
}

function SeatsFields({ control }: { control: import("react-hook-form").Control<DepartureFormData> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <NumberField control={control} name="seatsTotal" label="Total Seats" min={1} />
      <NumberField control={control} name="seatsLeft" label="Seats Left" min={0} />
    </div>
  );
}

function NumberField({
  control,
  name,
  label,
  min,
  optional,
}: {
  control: import("react-hook-form").Control<DepartureFormData>;
  name: "price" | "offerPrice" | "seatsTotal" | "seatsLeft";
  label: string;
  min: number;
  /** When true an empty input means undefined rather than being coerced to min. */
  optional?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              className="h-11 rounded-xl"
              min={min}
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                if (optional && raw.trim() === "") {
                  field.onChange(undefined);
                  return;
                }
                const n = parseInt(raw, 10);
                field.onChange(Number.isFinite(n) ? n : optional ? undefined : min);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

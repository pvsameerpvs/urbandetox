"use client";

import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@urbandetox/utils";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FormSection } from "@/components/admin/FormSection";
import { FormActions } from "@/components/admin/FormActions";
import type { Departure, Package, Destination } from "@urbandetox/utils";
import { MapPin, PackageIcon, CalendarDays, Users, CreditCard, Tag } from "lucide-react";

const schema = z.object({
  code: z.string().min(1, "Departure code is required"),
  packageSlug: z.string().min(1, "Package is required"),
  destinationSlug: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  offerPrice: z.number().min(0, "Offer price must be 0 or more"),
  seatsTotal: z.number().min(1, "Must have at least 1 seat"),
  seatsLeft: z.number().min(0, "Seats left cannot be negative"),
  status: z.enum(["open", "filling", "full", "closed"]),
});

export type DepartureFormData = z.infer<typeof schema>;

interface DepartureFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Departure>;
  onSubmit: (data: DepartureFormData) => void;
  submitLabel: string;
  cancelHref: string;
  packages: Package[];
  destinations: Destination[];
}

export function DepartureForm({ mode, initialData, onSubmit, submitLabel, cancelHref, packages, destinations }: DepartureFormProps) {
  const form = useForm<DepartureFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: initialData?.code || "",
      packageSlug: initialData?.packageSlug || "",
      destinationSlug: initialData?.destinationSlug || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      price: initialData?.price || 0,
      offerPrice: initialData?.offerPrice || 0,
      seatsTotal: initialData?.seatsTotal || 10,
      seatsLeft: initialData?.seatsLeft || 10,
      status: (initialData?.status as DepartureFormData["status"]) || "open",
    },
  });

  const selectedPkgSlug = useWatch({ control: form.control, name: "packageSlug" });
  const selectedPkg = packages.find((p) => p.slug === selectedPkgSlug);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormSection>
          {/* Package Selection */}
          <FormField
            control={form.control}
            name="packageSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <PackageIcon className="h-4 w-4 text-brand" /> Package
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(slug) => {
                      field.onChange(slug);
                      const pkg = packages.find((p) => p.slug === slug);
                      if (pkg) {
                        form.setValue("destinationSlug", pkg.destinationSlug);
                        form.setValue("price", pkg.startingPrice);
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-xl w-full">
                      <SelectValue placeholder="Choose a package for this departure" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.slug} value={pkg.slug}>
                          <span className="flex items-center gap-2">
                            <span className="font-medium">{pkg.title}</span>
                            <span className="text-muted-foreground">· {pkg.durationLabel}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Package Preview Card */}
          {selectedPkg && (
            <div className="rounded-xl border border-brand/20 bg-brand/[0.03] p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                  <PackageIcon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{selectedPkg.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedPkg.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{destinations.find((d) => d.slug === selectedPkg.destinationSlug)?.name || selectedPkg.destinationSlug}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{selectedPkg.durationLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{selectedPkg.groupSize}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">From ₹{selectedPkg.startingPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {selectedPkg.seasonalTag && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Tag className="h-3.5 w-3.5 text-brand" />
                  <span className="text-brand font-medium">{selectedPkg.seasonalTag}</span>
                </div>
              )}
            </div>
          )}

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-brand" /> Departure Code
                </FormLabel>
                <FormControl>
                  <Input placeholder={mode === "create" ? "e.g. KAS3-JUN20" : undefined} className="h-11 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
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
              control={form.control}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" className="h-11 rounded-xl" min={0} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="offerPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" className="h-11 rounded-xl" min={0} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="seatsTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Seats</FormLabel>
                  <FormControl>
                    <Input type="number" className="h-11 rounded-xl" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seatsLeft"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seats Left</FormLabel>
                  <FormControl>
                    <Input type="number" className="h-11 rounded-xl" min={0} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select status">
                        {field.value && (
                          <span className="flex items-center gap-2">
                            <span className={cn(
                              "h-2 w-2 rounded-full",
                              field.value === "open" && "bg-emerald-500",
                              field.value === "filling" && "bg-amber-500",
                              field.value === "full" && "bg-red-500",
                              field.value === "closed" && "bg-slate-400"
                            )} />
                            <span className="capitalize">{field.value}</span>
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Open
                        </span>
                      </SelectItem>
                      <SelectItem value="filling">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" /> Filling
                        </span>
                      </SelectItem>
                      <SelectItem value="full">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500" /> Full
                        </span>
                      </SelectItem>
                      <SelectItem value="closed">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-400" /> Closed
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormActions submitLabel={submitLabel} cancelHref={cancelHref} />
        </FormSection>
      </form>
    </FormProvider>
  );
}

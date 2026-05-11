"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import type { Departure } from "@urbandetox/utils";

const schema = z.object({
  code: z.string().min(1, "Departure code is required"),
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
}

export function DepartureForm({ mode, initialData, onSubmit, submitLabel, cancelHref }: DepartureFormProps) {
  const form = useForm<DepartureFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: initialData?.code || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      price: initialData?.price || 0,
      offerPrice: initialData?.offerPrice || 0,
      seatsTotal: initialData?.seatsTotal || 10,
      seatsLeft: initialData?.seatsLeft || 10,
      status: (initialData?.status as DepartureFormData["status"]) || "open",
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormSection>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure Code</FormLabel>
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
                    <SelectTrigger className="h-11 rounded-xl w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="filling">Filling</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
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

"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@urbandetox/utils";
import { EyeOff } from "lucide-react";
import type { Control } from "react-hook-form";
import type { DepartureFormData } from "./schema";
import { toSelectValue } from "./schema";

interface StatusFieldsProps {
  control: Control<DepartureFormData>;
}

export function StatusFields({ control }: StatusFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Booking Status</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select status">
                    {field.value && <StatusPreview value={field.value} />}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <StatusOption value="open" color="bg-emerald-500" label="Open" />
                  <StatusOption value="filling" color="bg-amber-500" label="Filling" />
                  <StatusOption value="full" color="bg-red-500" label="Full" />
                  <StatusOption value="closed" color="bg-slate-400" label="Closed" />
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="tripStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
              Trip Outcome
              <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                internal only
              </span>
            </FormLabel>
            <FormControl>
              <Select
                value={toSelectValue(field.value)}
                onValueChange={(val) => field.onChange(val || undefined)}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select trip outcome">
                    {field.value && <TripStatusPreview value={field.value} />}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <TripStatusOption
                    value="finished"
                    color="bg-emerald-500"
                    label="Finished"
                    desc="trip completed as planned"
                  />
                  <TripStatusOption
                    value="postponed"
                    color="bg-amber-500"
                    label="Postponed"
                    desc="trip rescheduled to later"
                  />
                  <TripStatusOption
                    value="canceled"
                    color="bg-red-500"
                    label="Canceled"
                    desc="trip did not happen"
                  />
                </SelectContent>
              </Select>
            </FormControl>
            <p className="text-[11px] text-muted-foreground mt-1">
              Customers cannot see this. Used for internal record-keeping after the trip date passes.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function StatusPreview({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          value === "open" && "bg-emerald-500",
          value === "filling" && "bg-amber-500",
          value === "full" && "bg-red-500",
          value === "closed" && "bg-slate-400"
        )}
      />
      <span className="capitalize">{value}</span>
    </span>
  );
}

function StatusOption({ value, color, label }: { value: string; color: string; label: string }) {
  return (
    <SelectItem value={value}>
      <span className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", color)} /> {label}
      </span>
    </SelectItem>
  );
}

function TripStatusPreview({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          value === "finished" && "bg-emerald-500",
          value === "postponed" && "bg-amber-500",
          value === "canceled" && "bg-red-500"
        )}
      />
      <span className="capitalize">{value}</span>
    </span>
  );
}

function TripStatusOption({
  value,
  color,
  label,
  desc,
}: {
  value: string;
  color: string;
  label: string;
  desc: string;
}) {
  return (
    <SelectItem value={value}>
      <span className="flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", color)} /> {label} — {desc}
      </span>
    </SelectItem>
  );
}

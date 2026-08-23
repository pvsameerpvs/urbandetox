"use client";

import type { UseFormReturn } from "react-hook-form";
import { CONTENT_STATUSES, DESTINATION_TYPES } from "@urbandetox/utils";
import { Input } from "@urbandetox/ui";
import { ChipMultiSelect } from "@/components/shared/ChipMultiSelect";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import type { DestinationFormData } from "./DestinationForm";

interface DestinationTaxonomyFieldsProps {
  form: UseFormReturn<DestinationFormData>;
}

const TEXT_FIELDS = [
  { name: "state", label: "State", placeholder: "e.g. Kerala" },
  { name: "country", label: "Country", placeholder: "India" },
  { name: "bestTimeToVisit", label: "Best time to visit", placeholder: "e.g. June to September" },
  {
    name: "travelTimeFromBangalore",
    label: "Travel time from Bangalore",
    placeholder: "e.g. Overnight, approx. 10 hours",
  },
] as const;

export function DestinationTaxonomyFields({ form }: DestinationTaxonomyFieldsProps) {
  /* eslint-disable react-hooks/incompatible-library */
  const types = form.watch("destinationTypes") || [];
  const status = form.watch("status");
  /* eslint-enable react-hooks/incompatible-library */

  const toggleType = (value: string) => {
    const current = form.getValues("destinationTypes") || [];
    form.setValue(
      "destinationTypes",
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      { shouldValidate: true }
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TEXT_FIELDS.map((f) => (
          <FormField
            key={f.name}
            control={form.control}
            name={f.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{f.label}</FormLabel>
                <FormControl>
                  <Input placeholder={f.placeholder} className="h-11 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      <ChipMultiSelect
        label="Landscape types (drives Explore Detox filters)"
        options={DESTINATION_TYPES}
        selected={types}
        onToggle={toggleType}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          control={form.control}
          name="imageAlt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover image alt text</FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe the cover image for search and screen readers"
                  className="h-11 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Status</FormLabel>
          <select
            value={status}
            onChange={(e) => form.setValue("status", e.target.value, { shouldValidate: true })}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-brand/50"
          >
            {CONTENT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground">
            Only Active destinations appear on the public site.
          </p>
        </FormItem>
      </div>
    </div>
  );
}

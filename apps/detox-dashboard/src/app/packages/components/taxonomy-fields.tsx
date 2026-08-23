"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  AUDIENCES,
  FITNESS_LEVELS,
  PACKAGE_STATUSES,
  TERRAINS,
  THEMES,
} from "@urbandetox/utils";
import { Label } from "@urbandetox/ui";
import type { PackageFormData } from "./use-package-form";
import { ChipMultiSelect } from "@/components/shared/ChipMultiSelect";

type ArrayField = "audiences" | "themes" | "terrains";

interface TaxonomyFieldsProps {
  form: UseFormReturn<PackageFormData>;
}

export function TaxonomyFields({ form }: TaxonomyFieldsProps) {
  const toggle = (field: ArrayField, value: string) => {
    const current = form.getValues(field) || [];
    form.setValue(
      field,
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      { shouldValidate: true }
    );
  };

  /* eslint-disable react-hooks/incompatible-library */
  const audiences = form.watch("audiences") || [];
  const themes = form.watch("themes") || [];
  const terrains = form.watch("terrains") || [];
  const fitnessLevel = form.watch("fitnessLevel");
  const status = form.watch("status");
  /* eslint-enable react-hooks/incompatible-library */

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        These drive the filters on Explore Detox and the audience pages. Leave a
        group empty and this trip simply will not appear under that filter.
      </p>

      <ChipMultiSelect
        label="Who is this for"
        options={AUDIENCES}
        selected={audiences}
        onToggle={(v) => toggle("audiences", v)}
      />
      <ChipMultiSelect
        label="Experience type"
        options={THEMES}
        selected={themes}
        onToggle={(v) => toggle("themes", v)}
      />
      <ChipMultiSelect
        label="Landscape"
        options={TERRAINS}
        selected={terrains}
        onToggle={(v) => toggle("terrains", v)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Effort level</Label>
          <select
            {...form.register("fitnessLevel")}
            value={fitnessLevel}
            onChange={(e) => form.setValue("fitnessLevel", e.target.value, { shouldValidate: true })}
            className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-brand/50"
          >
            <option value="">Not set</option>
            {FITNESS_LEVELS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Package status</Label>
          <select
            {...form.register("status")}
            value={status}
            onChange={(e) => form.setValue("status", e.target.value, { shouldValidate: true })}
            className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-brand/50"
          >
            {PACKAGE_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground">
            Only Live packages appear on the public site.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
          ["isDomestic", "Domestic"],
          ["isWeekend", "Weekend trip"],
          ["womenFriendly", "Women friendly"],
          ["soloFriendly", "Solo friendly"],
        ] as const).map(([field, label]) => (
          <label key={field} className="flex items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              {...form.register(field)}
              className="h-4 w-4 rounded border-border accent-[var(--brand)]"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}

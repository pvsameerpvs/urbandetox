"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@urbandetox/ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { Package, Destination } from "@urbandetox/utils";
import { PackageIcon, MapPin, CalendarDays, Users, CreditCard, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { DepartureFormData } from "./schema";
import { toSelectValue } from "./schema";

interface PackageSelectFieldProps {
  control: Control<DepartureFormData>;
  packages: Package[];
  destinations: Destination[];
  setValue: UseFormSetValue<DepartureFormData>;
  mode: "create" | "edit";
}

function groupPackagesByDestination(
  packages: Package[],
  destinations: Destination[]
): Array<{ slug: string; dest: Destination | undefined; packages: Package[] }> {
  const groups = new Map<string, Package[]>();
  for (const pkg of packages) {
    const list = groups.get(pkg.destinationSlug) ?? [];
    list.push(pkg);
    groups.set(pkg.destinationSlug, list);
  }
  return Array.from(groups.entries()).map(([slug, pkgs]) => ({
    slug,
    dest: destinations.find((d) => d.slug === slug),
    packages: pkgs,
  }));
}

export function PackageSelectField({
  control,
  packages,
  destinations,
  setValue,
  mode,
}: PackageSelectFieldProps) {
  const selectedPkgSlug = useWatch({ control, name: "packageSlug" });
  const selectedPkg = packages.find((p) => p.slug === selectedPkgSlug);
  const hasPackages = packages.length > 0;
  const grouped = groupPackagesByDestination(packages, destinations);

  return (
    <>
      <FormField
        control={control}
        name="packageSlug"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <PackageIcon className="h-4 w-4 text-brand" /> Package
            </FormLabel>
            <FormControl>
              <Select
                value={toSelectValue(field.value)}
                onValueChange={(slug) => {
                  field.onChange(slug);
                  const pkg = packages.find((p) => p.slug === slug);
                  if (pkg) {
                    setValue("destinationSlug", pkg.destinationSlug, { shouldValidate: false });
                    setValue("price", pkg.startingPrice, { shouldValidate: false });
                    if (mode === "create") {
                      const currentImage = control._formValues.image;
                      if (!currentImage && pkg.coverImage) {
                        setValue("image", pkg.coverImage, { shouldValidate: false });
                      }
                    }
                  }
                }}
              >
                <SelectTrigger className="h-11 rounded-xl w-full" disabled={!hasPackages}>
                  <SelectValue
                    placeholder={
                      hasPackages ? "Choose a package for this departure" : "No packages available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {hasPackages ? (
                    grouped.map((group) => (
                      <SelectGroup key={group.slug}>
                        <SelectLabel className="text-xs font-semibold text-muted-foreground px-3 py-2">
                          {group.dest?.name || "Unknown Destination"}
                        </SelectLabel>
                        {group.packages.map((pkg) => (
                          <SelectItem key={pkg.slug} value={pkg.slug}>
                            <span className="flex items-center gap-2">
                              <span className="font-medium">{pkg.title}</span>
                              <span className="text-muted-foreground">· {pkg.durationLabel}</span>
                              <span className="text-[10px] text-muted-foreground">
                                ₹{pkg.startingPrice.toLocaleString("en-IN")}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-2">No packages found</p>
                      <Link
                        href="/packages/new"
                        className="text-xs font-semibold text-brand hover:underline"
                      >
                        Create a package first
                      </Link>
                    </div>
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
            <InfoRow icon={<MapPin className="h-3.5 w-3.5" />}>
              {destinations.find((d) => d.slug === selectedPkg.destinationSlug)?.name ||
                selectedPkg.destinationSlug}
            </InfoRow>
            <InfoRow icon={<CalendarDays className="h-3.5 w-3.5" />}>
              {selectedPkg.durationLabel}
            </InfoRow>
            <InfoRow icon={<Users className="h-3.5 w-3.5" />}>{selectedPkg.groupSize}</InfoRow>
            <InfoRow icon={<CreditCard className="h-3.5 w-3.5" />}>
              From ₹{selectedPkg.startingPrice.toLocaleString("en-IN")}
            </InfoRow>
          </div>
          {selectedPkg.seasonalTag && (
            <div className="flex items-center gap-1.5 text-xs">
              <Tag className="h-3.5 w-3.5 text-brand" />
              <span className="text-brand font-medium">{selectedPkg.seasonalTag}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}

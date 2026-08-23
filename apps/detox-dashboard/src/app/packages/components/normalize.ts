import {
  AUDIENCES,
  FITNESS_LEVELS,
  PACKAGE_STATUSES,
  TERRAINS,
  THEMES,
  type Audience,
  type FitnessLevel,
  type PackageStatus,
  type Terrain,
  type Theme,
} from "@urbandetox/utils";
import type { PackageFormData } from "./use-package-form";

/**
 * Adapts form values to what the API accepts.
 *
 * Selects and chip groups hand back plain strings, while the API validates with
 * `z.enum(...)`. Rather than casting, values are checked against the taxonomy at
 * runtime: unknown entries are dropped and blank optional text fields are
 * omitted instead of being sent as "".
 */
const OPTIONAL_TEXT = [
  "pickupPoint", "dropPoint", "pickupTime", "returnTime",
  "pickupMapImage", "pickupMapUrl", "transportType", "stayType", "roomSharing",
  "mealPlan", "cancellationPolicy", "seoTitle", "seoDescription",
] as const;

const keep = <T extends string>(
  options: ReadonlyArray<{ value: T }>,
  values: string[] | undefined
): T[] => {
  const allowed = new Set<string>(options.map((o) => o.value));
  return (values ?? []).filter((v): v is T => allowed.has(v));
};

const oneOf = <T extends string>(
  options: ReadonlyArray<{ value: T }>,
  value: string | undefined
): T | undefined => options.find((o) => o.value === value)?.value;

export function normalizePackagePayload(data: PackageFormData) {
  const base = { ...data } as PackageFormData & Record<string, unknown>;
  for (const key of OPTIONAL_TEXT) {
    if (typeof base[key] === "string" && (base[key] as string).trim() === "") {
      delete base[key];
    }
  }
  const {
    audiences: _a, themes: _t, terrains: _r,
    fitnessLevel: _f, status: _s,
    whatToPack: _w, thingsToKnow: _k,
    ...rest
  } = base;

  return {
    ...rest,
    audiences: keep<Audience>(AUDIENCES, data.audiences),
    themes: keep<Theme>(THEMES, data.themes),
    terrains: keep<Terrain>(TERRAINS, data.terrains),
    fitnessLevel: oneOf<FitnessLevel>(FITNESS_LEVELS, data.fitnessLevel) ?? null,
    status: oneOf<PackageStatus>(PACKAGE_STATUSES, data.status) ?? "live",
    whatToPack: (data.whatToPack ?? []).filter((x) => x.trim() !== ""),
    thingsToKnow: (data.thingsToKnow ?? []).filter((x) => x.trim() !== ""),
  };
}

import type { Destination, Package } from "@urbandetox/utils";

/**
 * India versus international.
 *
 * The client's requirement is that international trips get a visible face and
 * are not merged into the regular local trips. Scope lives on the destination
 * (`country`), not on the package, so packages are classified by the
 * destination they belong to.
 *
 * A missing country is treated as India rather than international: every row in
 * the table today is either "India" or "Sri Lanka", and defaulting the other way
 * would silently promote a domestic trip into the international section.
 */
export type TripScope = "india" | "international";

export const HOME_COUNTRY = "India";

export function scopeOfDestination(dest: Pick<Destination, "country">): TripScope {
  const country = (dest.country ?? "").trim();
  if (!country) return "india";
  return country.toLowerCase() === HOME_COUNTRY.toLowerCase() ? "india" : "international";
}

/** Destination slugs that sit outside India. */
export function internationalSlugs(destinations: Pick<Destination, "slug" | "country">[]): Set<string> {
  return new Set(
    destinations.filter((d) => scopeOfDestination(d) === "international").map((d) => d.slug)
  );
}

export function filterPackagesByScope<T extends Pick<Package, "destinationSlug">>(
  packages: T[],
  destinations: Pick<Destination, "slug" | "country">[],
  scope: TripScope | undefined
): T[] {
  if (!scope) return packages;
  const intl = internationalSlugs(destinations);
  return packages.filter((p) =>
    scope === "international" ? intl.has(p.destinationSlug) : !intl.has(p.destinationSlug)
  );
}

/** Parses the ?scope= value, ignoring anything unexpected. */
export function parseScope(raw: string | undefined): TripScope | undefined {
  return raw === "india" || raw === "international" ? raw : undefined;
}

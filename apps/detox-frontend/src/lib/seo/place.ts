import type { Destination } from "@urbandetox/utils";
import { prune, type JsonLdNode } from "./types";

/**
 * schema.org wants ISO 3166-1 alpha-2 in addressCountry. destinations.country
 * stores a display name and defaults to "India", so it is mapped rather than
 * passed through. An unmapped value is dropped instead of guessed: a wrong
 * country code is worse than no country at all.
 */
const COUNTRY_CODES: Record<string, string> = {
  india: "IN",
  "sri lanka": "LK",
};

export function countryCode(name?: string | null): string | undefined {
  if (!name) return undefined;
  const key = name.trim().toLowerCase();
  if (/^[a-z]{2}$/.test(key)) return key.toUpperCase();
  return COUNTRY_CODES[key];
}

/**
 * The geographic name inside a destination's brand name.
 *
 * Every row in the destinations table is named for the product, not the place:
 * "North Kerala Detox", "Kodai Detox", "Gokarna Detox". Feeding that straight
 * into a schema.org Place asserts that a place called "Gokarna Detox" exists,
 * and feeding it into addressLocality asserts a city by that name. Stripping the
 * trailing brand word yields the real toponym the page is actually about.
 */
export function placeName(dest: Destination): string {
  return dest.name.replace(/\s+detox\s*$/i, "").trim() || dest.name;
}

/**
 * A destination as a schema.org Place.
 *
 * addressLocality is deliberately absent. The only candidates in the table are
 * destinations.name (a product name) and destinations.region, which holds
 * things like "North Kerala, Western Ghats (Wayanad and Malabar hills)" and
 * "Tamil Nadu, Western Ghats" — a region blurb and a state, never a city. Some
 * destinations are genuinely regions rather than towns, so there is no locality
 * to state. addressRegion comes from destinations.state, which is clean.
 *
 * Fill destinations.state for sri-lanka (currently null) and this gets richer
 * for free; no code change needed.
 */
export function destinationPlace(dest: Destination, type = "Place"): JsonLdNode {
  const address = prune({
    "@type": "PostalAddress",
    addressRegion: dest.state || undefined,
    addressCountry: countryCode(dest.country),
  });

  return prune({
    "@type": type,
    name: placeName(dest),
    address: Object.keys(address).length > 1 ? address : undefined,
  });
}

import type { Destination, Package } from "@urbandetox/utils";
import { placeName } from "./place";
import { ORG_ID, WEBSITE_ID, absoluteUrl } from "./site";
import { packagePath, tripId } from "./trip";
import { prune, type JsonLdNode } from "./types";

/**
 * CollectionPage + ItemList for /detox, the trip browse route.
 *
 * Two deliberate restrictions:
 *
 * 1. The ItemList is only emitted for the unfiltered page. /detox reads
 *    audience, theme, terrain, fitness, duration, weekend, seasonalTag, q and
 *    budget out of searchParams, so ?theme=wellness renders a subset. Every
 *    filtered variant canonicalises back to bare /detox, and an ItemList that
 *    enumerated the subset while claiming to be the canonical /detox would
 *    describe a page Google is not indexing. Filtered views still get the
 *    CollectionPage and the breadcrumb, which are true regardless of filter.
 *
 * 2. Each entry is a reference to the TouristTrip @id the package's own detail
 *    page publishes in full, plus the name and url the card actually shows. It
 *    is not a second, competing copy of the trip description.
 */
export function buildTripCollectionNodes(
  packages: Package[],
  destinations: Destination[],
  isFiltered: boolean
): JsonLdNode[] {
  const url = absoluteUrl("/detox");
  // placeName, not d.name: the destinations table stores product names like
  // "Gokarna Detox". See lib/seo/place.ts.
  const destName = new Map(destinations.map((d) => [d.slug, placeName(d)]));

  const page = prune({
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "Explore Detox",
    description:
      "Offbeat small-group detox trips across South India, filterable by who is going, landscape, effort, duration and budget.",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en-IN",
  });

  if (isFiltered || packages.length === 0) return [page];

  return [
    page,
    prune({
      "@type": "ItemList",
      "@id": `${url}#trips`,
      name: "All Urban Detox trips",
      numberOfItems: packages.length,
      itemListOrder: "https://schema.org/ItemListUnordered",
      itemListElement: packages.map((pkg, i) =>
        prune({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(packagePath(pkg)),
          item: prune({
            "@type": "TouristTrip",
            "@id": tripId(pkg),
            name: pkg.title,
            url: absoluteUrl(packagePath(pkg)),
            provider: { "@id": ORG_ID },
            // The card shows the destination name, so it is fair to state it.
            // Trip.itinerary accepts a bare Place as well as an ItemList, which
            // is the shortest honest way to say where this trip goes.
            itinerary: destName.get(pkg.destinationSlug)
              ? prune({ "@type": "Place", name: destName.get(pkg.destinationSlug) })
              : undefined,
          }),
        })
      ),
    }),
  ];
}

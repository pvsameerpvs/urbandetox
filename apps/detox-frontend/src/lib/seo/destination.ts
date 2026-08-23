import { safeImageUrl, type Destination, type Package } from "@urbandetox/utils";
import { destinationPlace, placeName } from "./place";
import { ORG_ID, absoluteUrl } from "./site";
import { packagePath, tripId } from "./trip";
import { prune, type JsonLdNode } from "./types";

/**
 * TouristDestination for /detox/[destinationSlug], plus an ItemList pointing at
 * the trips that leave for it. TouristDestination is a Place subtype, so the
 * fields map cleanly onto the destinations table: name, description, image,
 * state/country as the address, and destination_types as `touristType`.
 *
 * The name is the geographic name, not destinations.name: see lib/seo/place.ts
 * for why "Gokarna Detox" must not be published as the name of a Place. The
 * page's own <h1> keeps the brand wording; this node describes the real place.
 */
export function buildDestinationNode(dest: Destination, packages: Package[]): JsonLdNode[] {
  const path = `/detox/${dest.slug}`;
  const url = absoluteUrl(path);

  const destination = prune({
    ...destinationPlace(dest, "TouristDestination"),
    "@id": `${url}#destination`,
    alternateName: dest.name,
    description: dest.seoDescription || dest.description,
    url,
    image: absoluteUrl(safeImageUrl(dest.image)),
    touristType: dest.destinationTypes ?? undefined,
  });

  if (packages.length === 0) return [destination];

  return [
    destination,
    prune({
      "@type": "ItemList",
      "@id": `${url}#trips`,
      name: `Detox trips to ${placeName(dest)}`,
      numberOfItems: packages.length,
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
          }),
        })
      ),
    }),
  ];
}

import { safeImageUrl, type Destination, type Package } from "@urbandetox/utils";
import { placeName } from "./place";
import { ORG_ID, absoluteUrl } from "./site";
import { prune, type JsonLdNode } from "./types";

const AUDIENCE_LABELS: Record<string, string> = {
  solo: "Solo travellers",
  family: "Families",
  couples: "Couples",
  corporate: "Corporate groups",
  college: "College groups",
  b2b: "Travel partners",
};

/**
 * Shortest string worth publishing as a description.
 *
 * packages.seo_description and packages.subtitle are admin-editable and live
 * data still holds stand-ins: iim-calicut-sec-2-trip has the subtitle "Temp".
 * Emitting that as the machine-readable summary of a trip is worse than
 * emitting nothing, and unlike a price there is no flag to gate it behind. A
 * floor is a blunt rule, but "Temp" and "TBD" fail it and every real
 * description in the table clears it comfortably. Fix the rows; this only stops
 * the bleeding.
 */
const MIN_DESCRIPTION_CHARS = 40;

function publishableDescription(...candidates: Array<string | null | undefined>) {
  return candidates
    .map((c) => c?.trim())
    .find((c): c is string => Boolean(c && c.length >= MIN_DESCRIPTION_CHARS));
}

export function packagePath(pkg: Package): string {
  return `/detox/${pkg.destinationSlug}/${pkg.slug}`;
}

export function tripId(pkg: Package): string {
  return `${absoluteUrl(packagePath(pkg))}#trip`;
}

/**
 * TouristTrip, not Product and not bare Trip.
 *
 * Product+Offer would make the page eligible for merchant listings, which
 * demands a real, final, transactable price and inventory — with the 10000 INR
 * placeholder still in the database that is a misleading-price risk, and a
 * guided multi-day departure is a service rather than a shippable good. Trip is
 * the right shape but abstract. TouristTrip is Trip's tourism subtype and
 * carries `touristType` and `itinerary`, so it describes the package without
 * claiming commerce semantics the data cannot back yet.
 *
 * Note that schema.org Trip (and therefore TouristTrip) has no `duration` and
 * no participant-capacity property. Trip's properties are arrivalTime,
 * departureTime, itinerary, offers, partOfTrip, provider, subTrip and
 * tripOrigin. Duration, the max-10 group cap and seats-left all live on the
 * per-departure Event nodes below, which is where schema.org actually models
 * them (`duration`, `maximumAttendeeCapacity`, `remainingAttendeeCapacity`).
 */
export function buildTouristTripNode(pkg: Package, dest: Destination): JsonLdNode {
  const url = absoluteUrl(packagePath(pkg));
  const images = [pkg.coverImage, ...(pkg.gallery ?? [])]
    .filter(Boolean)
    .slice(0, 6)
    .map((src) => absoluteUrl(safeImageUrl(src)));

  const touristType = [
    ...(pkg.audiences ?? []).map((a) => AUDIENCE_LABELS[a] ?? a),
    pkg.soloFriendly ? "Solo travellers" : undefined,
    pkg.womenFriendly ? "Women travellers" : undefined,
  ].filter((v): v is string => Boolean(v));

  return prune({
    "@type": "TouristTrip",
    "@id": tripId(pkg),
    name: pkg.title,
    description: publishableDescription(pkg.seoDescription, pkg.subtitle),
    url,
    image: images,
    provider: { "@id": ORG_ID },
    touristType: Array.from(new Set(touristType)),
    // Every package departs from Bengaluru (packages.pickup_point holds the
    // exact landmark). PostalAddress rather than a free-text address string so
    // the city and region are separately machine-readable.
    tripOrigin: pkg.pickupPoint
      ? prune({
          "@type": "Place",
          name: pkg.pickupPoint,
          address: prune({
            "@type": "PostalAddress",
            streetAddress: pkg.pickupPoint,
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          }),
        })
      : undefined,
    itinerary: buildItinerary(pkg, dest),
  });
}

function buildItinerary(pkg: Package, dest: Destination): JsonLdNode | undefined {
  const days = pkg.itinerary ?? [];
  if (days.length === 0) return undefined;
  return prune({
    "@type": "ItemList",
    numberOfItems: days.length,
    itemListElement: days.map((day, i) =>
      prune({
        "@type": "ListItem",
        position: day.day ?? i + 1,
        name: day.title,
        description: [day.description, ...(day.activities ?? [])].filter(Boolean).join(" "),
        item: prune({ "@type": "Place", name: placeName(dest) }),
      })
    ),
  });
}

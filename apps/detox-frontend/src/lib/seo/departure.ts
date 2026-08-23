import type { Departure, Destination, Package } from "@urbandetox/utils";
import { destinationPlace } from "./place";
import { ORG_ID, absoluteUrl, publishablePrice } from "./site";
import { packagePath, tripId } from "./trip";
import { prune, type JsonLdNode } from "./types";

function availability(dep: Departure): string {
  if (dep.status === "full" || dep.seatsLeft <= 0) return "https://schema.org/SoldOut";
  if (dep.status === "closed") return "https://schema.org/OutOfStock";
  if (dep.status === "filling") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}

/**
 * Whether it is truthful to publish a seat count for this departure.
 *
 * Live data has departures with status "closed" and seats_left 19, which would
 * otherwise emit `availability: OutOfStock` next to `inventoryLevel: 19` in the
 * same Offer. That self-contradiction is worse than silence: a crawler has no
 * way to decide which half to believe. When the departure is not actually
 * sellable, availability alone is published and the counts are withheld.
 */
function seatCountsArePublishable(dep: Departure): boolean {
  return (dep.status === "open" || dep.status === "filling") && dep.seatsLeft > 0;
}

function eventStatus(dep: Departure): string {
  if (dep.tripStatus === "canceled") return "https://schema.org/EventCancelled";
  if (dep.tripStatus === "postponed") return "https://schema.org/EventPostponed";
  return "https://schema.org/EventScheduled";
}

/**
 * ISO 8601 duration for the departure's own span, inclusive of both end days,
 * so "2026-07-03" to "2026-07-05" is P3D.
 *
 * Derived from the departure dates rather than packages.duration on purpose.
 * The two disagree in live data — iim-calicut-sec-2-trip has duration 2 while
 * departure NKL-003 spans three calendar days — and startDate/endDate are
 * already published on this same node. A duration that contradicts the dates
 * beside it is an unforced error, so the dates win and the package column is
 * treated as the thing to go fix.
 */
function departureDuration(dep: Departure): string | undefined {
  const start = Date.parse(`${dep.startDate}T00:00:00Z`);
  const end = Date.parse(`${dep.endDate}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return undefined;
  const days = Math.round((end - start) / 86_400_000) + 1;
  return days > 0 ? `P${days}D` : undefined;
}

/**
 * One Event per departure. This is where the facts the trip node cannot hold
 * actually belong: `startDate`/`endDate` from departures.start_date/end_date,
 * `duration` derived from that same span, `maximumAttendeeCapacity` from
 * departures.seats_total and `remainingAttendeeCapacity` from
 * departures.seats_left. schema.org Trip has none of these properties, which is
 * the whole reason the departures are separate nodes rather than trip fields.
 *
 * Only pass departures that the page renders. DeparturesSection slices to four
 * or five rows, and Google's general structured-data policy requires marked-up
 * content to be visible to the user on that page.
 */
export function buildDepartureEventNodes(
  pkg: Package,
  dest: Destination,
  departures: Departure[]
): JsonLdNode[] {
  const url = absoluteUrl(packagePath(pkg));

  return departures.map((dep) => {
    const price = publishablePrice(dep.offerPrice ?? dep.price);
    const seats = seatCountsArePublishable(dep);
    return prune({
      "@type": "Event",
      "@id": `${url}#departure-${dep.code}`,
      name: `${pkg.title} — ${dep.startDate}`,
      url: `${url}?departure=${encodeURIComponent(dep.code)}`,
      about: { "@id": tripId(pkg) },
      organizer: { "@id": ORG_ID },
      // Dates are already YYYY-MM-DD in the departures table. Times are
      // optional there, so they are only appended when present, with the +05:30
      // offset the booking flow already assumes (Asia/Kolkata).
      startDate: dep.startTime ? `${dep.startDate}T${dep.startTime}:00+05:30` : dep.startDate,
      endDate: dep.endTime ? `${dep.endDate}T${dep.endTime}:00+05:30` : dep.endDate,
      duration: departureDuration(dep),
      eventStatus: eventStatus(dep),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: destinationPlace(dest),
      // seats_total is the real cap per departure, not a hardcoded 10. Live
      // rows include a 20-seat charter, so reading the column is what keeps the
      // markup honest even where the marketing copy says "groups of 10".
      maximumAttendeeCapacity: dep.seatsTotal > 0 ? dep.seatsTotal : undefined,
      remainingAttendeeCapacity: seats ? dep.seatsLeft : undefined,
      // Price is gated: see publishablePrice. Availability is always true, so
      // the Offer still carries it when both price and seat count are withheld.
      offers: prune({
        "@type": "Offer",
        url: absoluteUrl(`/book/${dep.code}`),
        availability: availability(dep),
        inventoryLevel: seats
          ? prune({ "@type": "QuantitativeValue", value: dep.seatsLeft })
          : undefined,
        price: price ?? undefined,
        priceCurrency: price ? "INR" : undefined,
      }),
    });
  });
}

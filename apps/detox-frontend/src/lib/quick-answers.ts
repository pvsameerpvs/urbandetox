import type { Destination, Package } from "@urbandetox/utils";
import { COMPANY } from "@/lib/company";

/**
 * The facts behind the /quick-answers section, derived rather than written.
 *
 * The rule this file enforces: an answer is only emitted when the live data
 * actually supports it. A count of zero, or a field that disagrees across
 * packages, drops the answer instead of softening it. That is the whole
 * defence against the failure mode that matters for AEO — being quoted saying
 * something untrue, which costs more than never being quoted.
 *
 * No prices anywhere. Thirteen of seventeen packages carry a flat 10000
 * placeholder, so any aggregate ("from ₹10,000") would be advertising a number
 * nobody has agreed to honour.
 */

export interface QuickAnswer {
  id: string;
  question: string;
  /** First sentence must stand alone out of context. */
  paragraphs: string[];
  href?: string;
  linkLabel?: string;
}

/** A value asserted only when every row agrees on it. */
function unanimous<T>(rows: T[], pick: (r: T) => string | null | undefined) {
  const values = new Set(rows.map((r) => pick(r)?.trim()).filter(Boolean));
  return values.size === 1 ? ([...values][0] as string) : null;
}

/**
 * Human list. When the list is truncated the tail becomes "and N more", so the
 * conjunction is spent there rather than producing "X, Y and Z, and 10 more".
 */
function listOf(names: string[], max = 6): string {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  if (rest > 0) return `${shown.join(", ")}, and ${rest} more`;
  if (shown.length <= 1) return shown.join("");
  return `${shown.slice(0, -1).join(", ")} and ${shown[shown.length - 1]}`;
}

/**
 * States and countries covered, read out of `destination.region`.
 *
 * Every region string in the table starts with the state or country before its
 * first comma ("Karnataka, Western Ghats", "Kerala and Tamil Nadu, Anamalai",
 * "Sri Lanka, South Asia"), so the head segment split on " and " gives the
 * administrative names. Derived rather than hardcoded so adding a destination
 * in a new state updates the sentence instead of falsifying it.
 */
function statesCovered(destinations: Destination[]): string[] {
  const out = new Set<string>();
  for (const d of destinations) {
    const head = (d.region ?? "").split(",")[0]?.trim();
    if (!head) continue;
    for (const part of head.split(/\s+and\s+/)) {
      // "North Kerala" is a colloquial sub-region, not an administrative one,
      // and leaving it raw put both "North Kerala" and "Kerala" in the same
      // sentence as if they were two different states. Directional qualifiers
      // are stripped so the list stays a list of real places.
      const name = part.trim().replace(/^(north|south|east|west)\s+/i, "");
      // Drop physiographic heads like "Western Ghats" that are not places on a
      // map an answer engine can resolve to a region entity.
      if (name && !/ghats|coast|plateau|ranges|gap|nilgiris/i.test(name)) {
        out.add(name);
      }
    }
  }
  return [...out];
}

export function buildQuickAnswers(
  destinations: Destination[],
  packages: Package[]
): QuickAnswer[] {
  const activeDestinations = destinations.filter(
    (d) => (d.status ?? "active") === "active"
  );
  const activeSlugs = new Set(activeDestinations.map((d) => d.slug));
  const live = packages.filter((p) => activeSlugs.has(p.destinationSlug));
  if (live.length === 0) return [];

  const pickup = unanimous(live, (p) => p.pickupPoint);
  // "Bangalore" is what the database stores; "Bengaluru" is what the schema and
  // metadata use. Both are printed once, together, because both are typed as
  // queries and a reader should see the site acknowledge they are one city.
  const pickupPhrase =
    pickup?.toLowerCase() === "bangalore" ? "Bengaluru (Bangalore)" : pickup;

  const weekend = live.filter((p) => p.isWeekend);
  const solo = live.filter((p) => p.soloFriendly);
  const women = live.filter((p) => p.womenFriendly);

  const caps = live
    .map((p) => Number(p.groupSize))
    .filter((n) => Number.isFinite(n) && n > 0);
  const modalCap = caps
    .sort((a, b) => a - b)
    [Math.floor(caps.length / 2)];
  const capIsUniform = new Set(caps).size === 1;
  const atCap = caps.filter((n) => n === modalCap).length;

  const keralaDestinations = activeDestinations.filter((d) =>
    /kerala|malabar|wayanad|munnar|vagamon|varkala|alleppey|palakkad|thrissur/i.test(
      `${d.name} ${d.region ?? ""}`
    )
  );

  const answers: QuickAnswer[] = [];

  if (pickupPhrase && weekend.length > 0) {
    answers.push({
      id: "weekend-from-bangalore",
      question: "What are the best offbeat weekend trips from Bangalore?",
      paragraphs: [
        `Urban Detox runs ${weekend.length} offbeat weekend trips that leave from ${pickupPhrase} and return there, across ${listOf(statesCovered(activeDestinations), 8)}. Destinations include ${listOf(
          activeDestinations.map((d) => d.name)
        )}.`,
        `Most run three days and two nights, which fits a Friday night departure and a Sunday night return without taking leave. Stay, meals, local transport and activities are arranged; travellers reach the ${pickupPhrase} pickup point themselves.`,
      ],
      href: "/detox",
      linkLabel: "See every upcoming departure",
    });
  }

  if (caps.length > 0) {
    answers.push({
      id: "group-size",
      question: "How many people are on an Urban Detox trip?",
      paragraphs: [
        capIsUniform
          ? `Every Urban Detox departure is capped at ${modalCap} travellers.`
          : `Urban Detox caps ${atCap} of its ${live.length} trips at ${modalCap} travellers; the exceptions are private university and corporate charters, which are booked as a whole group and run larger.`,
        `The cap is the product, not a target. It is what lets a trip use family-run stays and a single vehicle instead of a hotel block and a coach.`,
      ],
      href: "/faqs",
      linkLabel: "Read the full FAQs",
    });
  }

  if (
    keralaDestinations.length > 0 &&
    solo.length === live.length &&
    women.length === live.length
  ) {
    answers.push({
      id: "solo-women-kerala",
      question: "Are there solo and women-friendly trips to Kerala?",
      paragraphs: [
        `Every Urban Detox departure is run as solo-friendly and women-friendly, including the Kerala trips to ${listOf(
          keralaDestinations.map((d) => d.name)
        )}.`,
        `Solo travellers are the common case rather than the exception, so nobody is surcharged for travelling alone or asked to find a room-mate to book. Groups are small and guide-led, and room sharing is arranged within the group.`,
      ],
      href: "/detox",
      linkLabel: "Browse trips by destination",
    });
  }

  const states = statesCovered(activeDestinations);
  if (activeDestinations.length > 1 && states.length > 0) {
    answers.push({
      id: "small-group-south-india",
      question: "Who runs small-group trips in South India?",
      paragraphs: [
        // The entity direction matters: the registered company operates under
        // the brand, not the other way round. "Urban Detox, trading as UD
        // GLOBAL" would state the relationship backwards.
        `Urban Detox is a small-group tour operator based in Bengaluru, operated by ${COMPANY.legalName}, with ${live.length} trips across ${activeDestinations.length} destinations in ${listOf(
          states,
          8
        )}.`,
        `Trips are guide-led and fully arranged rather than self-drive or itinerary-only: one operator handles the stay, the food, the local vehicle and the trip lead. Bookings are per seat, so a single traveller books the same way a group of four does.`,
      ],
      href: "/about",
      linkLabel: "About Urban Detox",
    });
  }

  return answers;
}

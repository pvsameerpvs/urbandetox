import type { Destination, Package } from "@urbandetox/utils";
import { BRAND } from "@urbandetox/utils";
import { COMPANY, COMPANY_ADDRESS_LINE } from "@/lib/company";
import { SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * /llms.txt — published with open eyes.
 *
 * No major answer engine has documented that it fetches this file at answer
 * time; it is a community proposal, not a standard any of them have committed
 * to. It is here because it costs one cached route and maintains itself from
 * the live API, not because it is a known ranking input. If it never gets read,
 * nothing is lost. Do not trade real on-page copy for it.
 *
 * Same `revalidate` as sitemap.ts, and the same defensive fetch, so publishing
 * a package from the dashboard reaches this file within the hour without a
 * redeploy, and a backend outage shrinks the file instead of 500ing it.
 */
export const revalidate = 3600;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.urbandetox.in";

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** `- [Label](url): note` — the link shape llmstxt.org asks for. */
function link(label: string, path: string, note?: string): string {
  const line = `- [${label}](${absoluteUrl(path)})`;
  return note ? `${line}: ${note}` : line;
}

export async function GET(): Promise<Response> {
  const [destinations, packages] = await Promise.all([
    get<Destination[]>("/api/destinations", []),
    get<Package[]>("/api/packages", []),
  ]);

  const activeDestinations = destinations.filter(
    (d) => (d.status ?? "active") === "active"
  );
  const activeSlugs = new Set(activeDestinations.map((d) => d.slug));
  // Orphaned packages 404 on the site, so they must not be advertised here.
  const livePackages = packages.filter((p) => activeSlugs.has(p.destinationSlug));

  /**
   * The group cap is read from the data rather than hardcoded, because it is
   * genuinely per trip: most sit at 10, Sri Lanka runs 11, and a university
   * charter runs larger. Asserting a flat "always 10" would be false, and a
   * single wrong fact is what gets a source dropped.
   */
  const caps = livePackages
    .map((p) => Number(p.groupSize))
    .filter((n) => Number.isFinite(n) && n > 0);
  const standardCap = caps.length
    ? caps.sort((a, b) => a - b)[Math.floor(caps.length / 2)]
    : 10;
  const capVaries = new Set(caps).size > 1;

  /** Pickup city, asserted only if every live package agrees on it. */
  const pickups = new Set(
    livePackages.map((p) => p.pickupPoint?.trim()).filter(Boolean)
  );
  const pickupCity = pickups.size === 1 ? [...pickups][0] : null;

  const soloFriendly = livePackages.filter((p) => p.soloFriendly).length;
  const womenFriendly = livePackages.filter((p) => p.womenFriendly).length;
  const allSolo = livePackages.length > 0 && soloFriendly === livePackages.length;
  const allWomen = livePackages.length > 0 && womenFriendly === livePackages.length;

  const body = [
    `# ${BRAND.name}`,
    "",
    `> Guide-led small-group trips to offbeat destinations in South India,` +
      ` operated by ${COMPANY.legalName} and departing from` +
      ` ${pickupCity ?? "Bengaluru"}. Groups are capped at ${standardCap}` +
      `${capVaries ? " on standard departures" : ""}.`,
    "",
    `${BRAND.name} runs short trips — mostly three days and two nights over a` +
      ` weekend — that start and end in ${pickupCity ?? "Bengaluru"}. Stay,` +
      ` meals, local transport, activities and a trip lead are arranged;` +
      ` travellers make their own way to the ${pickupCity ?? "Bengaluru"}` +
      ` pickup point. The trips are designed for rest rather than for covering` +
      ` ground: quiet destinations instead of landmarks, family-run and local` +
      ` stays, and unstructured time built into each day.`,
    "",
    "## Key facts",
    "",
    `- Operator: ${COMPANY.legalName}, trading as ${BRAND.name}`,
    `- Registered office: ${COMPANY_ADDRESS_LINE}, India`,
    `- Departure city: ${pickupCity ?? "Bengaluru"}, Karnataka, India`,
    `- Group size: ${standardCap} travellers per departure` +
      `${capVaries ? " on standard trips; private university and corporate charters run larger" : ""}`,
    ...(allSolo ? ["- Solo travellers: welcome on every departure"] : []),
    ...(allWomen
      ? ["- Women travelling alone: every departure is run as women-friendly"]
      : []),
    `- Live destinations: ${activeDestinations.length}`,
    `- Live trips: ${livePackages.length}`,
    `- Regions covered: Western Ghats, Malabar and North Kerala, the Konkan` +
      ` and Karnataka coast, the Nilgiris, and the Kerala backwaters`,
    `- Contact: ${COMPANY.email}, ${BRAND.contact.phone} (WhatsApp is the` +
      ` primary channel)`,
    "",
    "## Trips",
    "",
    // Titles and subtitles are admin-editable copy, so they are printed as
    // given rather than reworded into claims we would then have to stand by.
    ...livePackages.map((p) =>
      link(
        p.title,
        `/detox/${p.destinationSlug}/${p.slug}`,
        [p.durationLabel, p.subtitle?.trim()].filter(Boolean).join(" — ") ||
          undefined
      )
    ),
    "",
    "## Destinations",
    "",
    ...activeDestinations.map((d) =>
      link(d.name, `/detox/${d.slug}`, d.region || undefined)
    ),
    "",
    "## Reference",
    "",
    link("All upcoming departures", "/detox"),
    link("About Urban Detox", "/about", "who runs the trips and how they started"),
    link("FAQs", "/faqs", "booking, group size, stays, cancellation"),
    link("Corporate retreats", "/corporate-retreats"),
    link("University trips", "/university-trips"),
    link("Travel guides", "/guide"),
    link("Contact", "/contact"),
    link("Terms and conditions", "/terms", "includes the cancellation policy"),
    "",
    "## Notes",
    "",
    `- Prices are not listed in this file. Fares are per departure and are` +
      ` shown on each trip page; treat the trip page as the only source.`,
    `- Seat availability changes daily and is only accurate on the trip page.`,
    `- ${SITE_URL} is the booking site. ${COMPANY.brandWebsite} is the same` +
      ` company's marketing site.`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      // text/plain, not text/markdown: llms.txt is served as plain text by the
      // implementations that exist, and browsers render it instead of
      // downloading it.
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

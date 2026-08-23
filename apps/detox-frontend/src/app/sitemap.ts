import type { MetadataRoute } from "next";
import type { Destination, GuideArticle, Package } from "@urbandetox/utils";
import { absoluteUrl } from "@/lib/site";

/**
 * Regenerated hourly instead of frozen at build time.
 *
 * The sitemap is a Route Handler: per the Next 16 docs it is "cached by
 * default unless it uses a Request-time API or dynamic config option", so
 * without this export the XML would be baked from whatever the API returned
 * during `next build` and never change again. Publishing a package from the
 * dashboard has to reach Google without a redeploy, hence ISR.
 */
export const revalidate = 3600;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.urbandetox.in";

/** Departure rows return `updated_at`; the shared `Departure` type omits it. */
type DepartureStamp = { packageSlug: string; updatedAt?: string };

/** A backend hiccup must shrink the sitemap, never 500 it or fail the build. */
async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/detox", changeFrequency: "daily", priority: 0.9 },
  { path: "/guide", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about", changeFrequency: "yearly", priority: 0.4 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  { path: "/corporate-retreats", changeFrequency: "monthly", priority: 0.5 },
  { path: "/university-trips", changeFrequency: "monthly", priority: 0.5 },
  { path: "/join-us", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.1 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, packages, guides, departures] = await Promise.all([
    // Returns every row regardless of status — filtered below.
    get<Destination[]>("/api/destinations", []),
    // Public list endpoint already restricts to status = "live".
    get<Package[]>("/api/packages", []),
    get<GuideArticle[]>("/api/guides", []),
    get<DepartureStamp[]>("/api/departures", []),
  ]);

  // Newest departure edit per package is the only real "content changed"
  // signal in the schema: destinations, packages and guides have no
  // updated_at column. Where there is no signal, lastModified is omitted
  // rather than faked — an unreliable lastmod gets ignored wholesale.
  const touchedByPackage = new Map<string, Date>();
  for (const dep of departures) {
    if (!dep.updatedAt) continue;
    const at = new Date(dep.updatedAt);
    if (Number.isNaN(at.getTime())) continue;
    const prev = touchedByPackage.get(dep.packageSlug);
    if (!prev || at > prev) touchedByPackage.set(dep.packageSlug, at);
  }

  const publicDestinations = destinations.filter(
    (d) => (d.status ?? "active") === "active"
  );
  const publicSlugs = new Set(publicDestinations.map((d) => d.slug));

  // /detox/[destinationSlug]/[packageSlug] calls notFound() when the
  // destination is missing, so orphaned packages would be 404s in the sitemap.
  const publicPackages = packages.filter((p) => publicSlugs.has(p.destinationSlug));

  const newest = (dates: Array<Date | undefined>): Date | undefined =>
    dates.filter((d): d is Date => !!d).sort((a, b) => b.getTime() - a.getTime())[0];

  return [
    ...STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      changeFrequency,
      priority,
    })),

    ...publicDestinations.map((dest) => ({
      url: absoluteUrl(`/detox/${dest.slug}`),
      lastModified: newest(
        publicPackages
          .filter((p) => p.destinationSlug === dest.slug)
          .map((p) => touchedByPackage.get(p.slug))
      ),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...publicPackages.map((pkg) => ({
      url: absoluteUrl(`/detox/${pkg.destinationSlug}/${pkg.slug}`),
      lastModified: touchedByPackage.get(pkg.slug),
      changeFrequency: "weekly" as const,
      priority: pkg.featured ? 0.8 : 0.7,
    })),

    ...guides.map((guide) => ({
      url: absoluteUrl(`/guide/${guide.slug}`),
      changeFrequency: "monthly" as const,
      priority: guide.featured ? 0.6 : 0.5,
    })),
  ];
}

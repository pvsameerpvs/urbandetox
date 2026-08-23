import type { Metadata } from "next";
import { fetchDestinations, fetchFilteredPackages, fetchPackages, type PackageFilters } from "@/lib/api";
import { filterPackagesByScope, internationalSlugs, parseScope } from "@/lib/trip-scope";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildTripCollectionNodes } from "@/lib/seo/collection";
import { buildBreadcrumbNode } from "@/lib/seo/breadcrumb";
import { DetoxFilterBar } from "./components/DetoxFilterBar";
import { ScopeTabs } from "./components/ScopeTabs";
import { DetoxResults } from "./components/DetoxResults";
import { DestinationBrowseCard } from "./components/DestinationBrowseCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Detox | Offbeat Small-Group Trips | Urban Detox",
  description:
    "Filter offbeat detox trips by who's going, landscape, effort, duration and budget. Small groups of 10, everything planned.",
};

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
const many = (v: string | string[] | undefined) =>
  one(v)?.split(",").filter(Boolean) ?? undefined;

export default async function DetoxBrowsePage({ searchParams }: PageProps) {
  const q = searchParams ? await searchParams : {};

  /**
   * Bands go to the API as bands. Flattening several into one min/max span was
   * wrong: "Under 10,000" plus "15,000 - 25,000" became 0 to 24,999 and
   * returned the middle band the visitor had excluded, and any band with an
   * open top dropped the ceiling entirely. The controller ORs the ranges.
   */
  const budget = many(q.budget);

  const filters: PackageFilters = {
    audience: many(q.audience),
    theme: many(q.theme),
    terrain: many(q.terrain),
    fitness: many(q.fitness),
    duration: many(q.duration)?.map(Number).filter(Number.isFinite),
    weekend: one(q.weekend) === "true",
    seasonalTag: one(q.seasonalTag),
    q: one(q.q),
    budget,
  };

  const [destinations, packages, allPackages] = await Promise.all([
    fetchDestinations().catch(() => []),
    fetchFilteredPackages(filters).catch(() => []),
    // Unfiltered, for the duration chips and the browse-by-destination counts.
    fetchPackages().catch(() => []),
  ]);

  /**
   * Only durations that a live trip actually has. This used to concat a
   * hardcoded [2, 3, 5, 6], so the bar shipped a "5 Days" chip that could
   * never match anything and always returned an empty result set. Derived from
   * allPackages, not the filtered list, so the chips do not vanish as you
   * filter.
   */
  /**
   * India versus international. The client asked for international trips to be
   * separated rather than merged into the local list, so this narrows the
   * rendered results and drives the counts on the tabs. Applied here rather
   * than in the API because scope lives on the destination, not the package.
   */
  const scope = parseScope(one(q.scope));
  const scoped = filterPackagesByScope(packages, destinations, scope);
  const intl = internationalSlugs(destinations);
  const scopedDestinations = scope
    ? destinations.filter((d) =>
        scope === "international" ? intl.has(d.slug) : !intl.has(d.slug)
      )
    : destinations;

  const scopeCounts = {
    all: allPackages.length,
    india: allPackages.filter((p) => !intl.has(p.destinationSlug)).length,
    international: allPackages.filter((p) => intl.has(p.destinationSlug)).length,
  };

  const durations = Array.from(new Set(allPackages.map((p) => p.duration)))
    .filter((d) => Number.isFinite(d) && d > 0)
    .sort((a, b) => a - b);

  // Any active filter narrows the rendered list, so the enumerating ItemList is
  // suppressed. See lib/seo/collection.ts.
  const isFiltered = Object.entries(filters).some(([k, v]) =>
    k === "weekend" ? v === true : Array.isArray(v) ? v.length > 0 : v !== undefined
  );

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        id="ld-detox-browse"
        nodes={[
          ...buildTripCollectionNodes(packages, destinations, isFiltered),
          buildBreadcrumbNode("/detox", [
            { name: "Home", path: "/" },
            { name: "Explore Detox", path: "/detox" },
          ]),
        ]}
      />
      <div className="relative bg-sidebar-dark overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          {/* `text-brand` on sidebar-dark measures 1.98:1, below the 4.5:1 minimum. */}
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-white/40" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Browse</span>
            <div className="h-px w-10 bg-white/40" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Detox
          </h1>
          <p className="text-base text-white/60 max-w-md mx-auto">
            Filter by who you are travelling with, the landscape you want, and how
            much effort you are up for.
          </p>
        </div>
      </div>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <ScopeTabs counts={scopeCounts} />
          <DetoxFilterBar durations={durations} resultCount={scoped.length} />
          <DetoxResults packages={scoped} destinations={destinations} />
        </div>
      </section>

      <section className="border-t border-border/60 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-brand/60" />
            {/* Was a styled span, so the page jumped from its h1 straight to
                seventeen h3 cards with no intermediate level. */}
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Or Browse by Destination
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Scoped as well, or picking "International" would still list all
                sixteen destinations underneath and undo the separation. */}
            {scopedDestinations.map((dest) => (
              <DestinationBrowseCard
                key={dest.slug}
                destination={dest}
                /* Counted from allPackages: using the filtered list made these
                   cards claim a destination had 0 trips whenever a filter
                   excluded them, which is not what the card says. */
                packageCount={allPackages.filter((p) => p.destinationSlug === dest.slug).length}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

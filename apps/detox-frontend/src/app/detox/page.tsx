import { fetchDestinations, fetchPackagesByDestination } from "@/lib/api";
import { DestinationBrowseCard } from "./components/DestinationBrowseCard";

export default async function DetoxBrowsePage() {
  const destinations = await fetchDestinations();

  // Pre-fetch package counts for all destinations
  const counts = await Promise.all(
    destinations.map((dest) => fetchPackagesByDestination(dest.slug).then((pkgs) => ({ slug: dest.slug, count: pkgs.length })))
  );
  const countMap = Object.fromEntries(counts.map((c) => [c.slug, c.count]));

  return (
    <main className="min-h-screen bg-white">
      <div className="relative bg-sidebar-dark overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Browse</span>
            <div className="h-px w-10 bg-brand" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Destination</h1>
          <p className="text-base text-white/60 max-w-md mx-auto">Pick a destination to explore detox packages curated for that landscape.</p>
        </div>
      </div>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationBrowseCard key={dest.slug} destination={dest} packageCount={countMap[dest.slug]} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

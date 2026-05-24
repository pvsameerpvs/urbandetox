import type { Departure, Package, Destination } from "@urbandetox/utils";

export function computeDepartureStats(departures: Departure[]) {
  return {
    total: departures.length,
    open: departures.filter((d) => d.status === "open").length,
    filling: departures.filter((d) => d.status === "filling").length,
    full: departures.filter((d) => d.status === "full").length,
    closed: departures.filter((d) => d.status === "closed").length,
    totalSeats: departures.reduce((sum, d) => sum + d.seatsTotal, 0),
  };
}

export function filterDepartures(
  departures: Departure[],
  query: string,
  packages: Package[],
  destinations: Destination[]
): Departure[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...departures].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }

  return departures
    .filter((d) => {
      const pkg = packages.find((p) => p.slug === d.packageSlug);
      const dest = destinations.find((de) => de.slug === d.destinationSlug);
      return (
        d.code.toLowerCase().includes(q) ||
        pkg?.title?.toLowerCase().includes(q) ||
        dest?.name?.toLowerCase().includes(q) ||
        d.startDate.includes(q)
      );
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

import type { Departure, Package, Destination } from "@urbandetox/utils";

export function getFillPercentage(dep: Departure): number {
  return Math.round(((dep.seatsTotal - dep.seatsLeft) / dep.seatsTotal) * 100);
}

export function getSeatColor(dep: Departure): string {
  if (dep.status === "full") return "bg-red-400";
  if (dep.status === "filling") return "bg-amber-400";
  return "bg-emerald-400";
}

export function getSeatTextColor(dep: Departure): string {
  if (dep.status === "full") return "text-red-500";
  if (dep.status === "filling") return "text-amber-600";
  return "";
}

export function getTripStatusColor(tripStatus: string): string {
  switch (tripStatus) {
    case "finished":
      return "text-emerald-600";
    case "postponed":
      return "text-amber-600";
    case "canceled":
      return "text-red-500";
    default:
      return "";
  }
}

export function getTripStatusDotColor(tripStatus: string): string {
  switch (tripStatus) {
    case "finished":
      return "bg-emerald-500";
    case "postponed":
      return "bg-amber-500";
    case "canceled":
      return "bg-red-500";
    default:
      return "";
  }
}

export function findRelatedData(
  dep: Departure,
  packages: Package[],
  destinations: Destination[]
) {
  return {
    pkg: packages.find((p) => p.slug === dep.packageSlug),
    dest: destinations.find((d) => d.slug === dep.destinationSlug),
  };
}

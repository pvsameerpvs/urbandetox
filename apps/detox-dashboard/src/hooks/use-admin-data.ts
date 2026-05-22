"use client";

import type { Destination, Package, Departure, SeasonalTag } from "@urbandetox/utils";
import {
  fetchDestinations,
  fetchDestinationBySlug,
  fetchPackages,
  fetchPackageBySlug,
  fetchDepartures,
  fetchSeasonalTags,
} from "@/lib/api";

export function useAdminDestinations() {
  return useApiFetch<Destination[]>(fetchDestinations, []);
}

export function useAdminDestination(slug: string) {
  return useApiFetch<Destination | undefined>(
    () => fetchDestinationBySlug(slug),
    undefined
  );
}

export function useAdminPackages() {
  return useApiFetch<Package[]>(fetchPackages, []);
}

export function useAdminPackage(slug: string) {
  return useApiFetch<Package | undefined>(
    () => fetchPackageBySlug(slug),
    undefined
  );
}

export function useAdminDepartures() {
  return useApiFetch<Departure[]>(fetchDepartures, []);
}

export function useAdminSeasonalTags() {
  return useApiFetch<SeasonalTag[]>(fetchSeasonalTags, []);
}

// ─── Generic fetch hook ──────────────────────────────
import { useState, useEffect } from "react";

function useApiFetch<T>(fetcher: () => Promise<T>, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        console.error("Dashboard API fetch failed:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}

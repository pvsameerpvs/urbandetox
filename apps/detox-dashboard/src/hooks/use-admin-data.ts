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
  /**
   * A failed fetch used to be logged and swallowed, leaving `data` at its
   * fallback. Every list screen then rendered its empty state, so an API
   * outage was indistinguishable from "nothing here yet" and an admin could
   * reasonably think the records had been deleted.
   */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        console.error("Dashboard API fetch failed:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not reach the API.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
}

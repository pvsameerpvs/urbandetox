"use client";

import { useState, useEffect } from "react";
import type { Destination, Package, Departure, SeasonalTag } from "@urbandetox/utils";
import { destinations as initialDestinations } from "@/data/destinations";
import { packages as initialPackages } from "@/data/packages";
import { departures as initialDepartures } from "@/data/departures";
import { initialSeasonalTags } from "@urbandetox/utils";
import {
  getDestinations,
  getPackages,
  getDepartures,
  getDestinationBySlug,
  getPackageBySlug,
  getSeasonalTags,
} from "@/lib/admin-data";

export function useAdminDestinations() {
  const [data, setData] = useState<Destination[]>(initialDestinations);
  useEffect(() => {
    const t = setTimeout(() => setData(getDestinations()), 0);
    return () => clearTimeout(t);
  }, []);
  return data;
}

export function useAdminDestination(slug: string) {
  const [data, setData] = useState<Destination | undefined>(() => initialDestinations.find((d) => d.slug === slug));
  useEffect(() => {
    const t = setTimeout(() => setData(getDestinationBySlug(slug)), 0);
    return () => clearTimeout(t);
  }, [slug]);
  return data;
}

export function useAdminPackages() {
  const [data, setData] = useState<Package[]>(initialPackages);
  useEffect(() => {
    const t = setTimeout(() => setData(getPackages()), 0);
    return () => clearTimeout(t);
  }, []);
  return data;
}

export function useAdminPackage(slug: string) {
  const [data, setData] = useState<Package | undefined>(() => initialPackages.find((p) => p.slug === slug));
  useEffect(() => {
    const t = setTimeout(() => setData(getPackageBySlug(slug)), 0);
    return () => clearTimeout(t);
  }, [slug]);
  return data;
}

export function useAdminDepartures() {
  const [data, setData] = useState<Departure[]>(initialDepartures);
  useEffect(() => {
    const t = setTimeout(() => setData(getDepartures()), 0);
    return () => clearTimeout(t);
  }, []);
  return data;
}

export function useAdminSeasonalTags() {
  const [data, setData] = useState<SeasonalTag[]>(initialSeasonalTags);
  useEffect(() => {
    const t = setTimeout(() => setData(getSeasonalTags()), 0);
    return () => clearTimeout(t);
  }, []);
  return data;
}

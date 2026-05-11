"use client";

import { useState, useEffect } from "react";
import {
  destinations as initialDestinations,
} from "../data/destinations";
import { packages as initialPackages } from "../data/packages";
import { departures as initialDepartures } from "../data/departures";
import {
  getDestinations,
  getPackages,
  getDepartures,
  getDestinationBySlug,
  getPackageBySlug,
  getPackagesByDestination,
  getDeparturesByPackage,
  getUpcomingDepartures,
} from "@/lib/admin-data";

export function useAdminDestinations() {
  const [data, setData] = useState(initialDestinations);
  useEffect(() => {
    const t = setTimeout(() => setData(getDestinations()), 0);
    return () => clearTimeout(t);
  }, []);
  return data;
}

export function useAdminDestination(slug: string) {
  const [data, setData] = useState(() => initialDestinations.find((d) => d.slug === slug));
  useEffect(() => {
    const t = setTimeout(() => setData(getDestinationBySlug(slug)), 0);
    return () => clearTimeout(t);
  }, [slug]);
  return data;
}

export function useAdminPackages() {
  const [data, setData] = useState(initialPackages);
  useEffect(() => {
    const t = setTimeout(() => setData(getPackages()), 0);
    return () => clearTimeout(t);
  }, []);
  return data;
}

export function useAdminPackage(slug: string) {
  const [data, setData] = useState(() => initialPackages.find((p) => p.slug === slug));
  useEffect(() => {
    const t = setTimeout(() => setData(getPackageBySlug(slug)), 0);
    return () => clearTimeout(t);
  }, [slug]);
  return data;
}

export function useAdminPackagesByDestination(destinationSlug: string) {
  const [data, setData] = useState(() => initialPackages.filter((p) => p.destinationSlug === destinationSlug));
  useEffect(() => {
    const t = setTimeout(() => setData(getPackagesByDestination(destinationSlug)), 0);
    return () => clearTimeout(t);
  }, [destinationSlug]);
  return data;
}

export function useAdminDepartures() {
  const [data, setData] = useState(initialDepartures);
  useEffect(() => {
    const t = setTimeout(() => setData(getDepartures()), 0);
    return () => clearTimeout(t);
  }, []);
  return data;
}

export function useAdminDeparturesByPackage(packageSlug: string) {
  const [data, setData] = useState(() => initialDepartures.filter((d) => d.packageSlug === packageSlug));
  useEffect(() => {
    const t = setTimeout(() => setData(getDeparturesByPackage(packageSlug)), 0);
    return () => clearTimeout(t);
  }, [packageSlug]);
  return data;
}

export function useAdminUpcomingDepartures(limit = 50) {
  const [data, setData] = useState(() => getUpcomingDepartures(limit));
  useEffect(() => {
    const t = setTimeout(() => setData(getUpcomingDepartures(limit)), 0);
    return () => clearTimeout(t);
  }, [limit]);
  return data;
}

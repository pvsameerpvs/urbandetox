"use client";

import { useCallback, useEffect, useState } from "react";
import { type BookingState } from "@urbandetox/utils";
import { useUserProfile } from "@/lib/user-profile";
import { loadBookingState, saveBookingState } from "@/lib/booking-storage";

const FALLBACK: Pick<BookingState, "departureCode" | "travelers" | "common"> = {
  departureCode: "",
  travelers: [],
  common: { groupNote: "", modeOfArrival: "", needsTravelHelp: false },
};

/**
 * Centralized booking hook.
 * - `booking` — current localStorage state (read-only snapshot).
 * - `save(patch)` — merges with existing state, auto-enriches `bookedBy`
 *   fields from the active user profile, and persists to localStorage.
 * - `load()` — re-reads localStorage for the departure code.
 */
export function useBooking(departureCode: string) {
  const { profile, isLoggedIn } = useUserProfile();

  const [booking, setBooking] = useState<BookingState | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setBooking(loadBookingState(departureCode)),
      0
    );
    return () => window.clearTimeout(timer);
  }, [departureCode]);

  const save = useCallback(
    (patch: Partial<Omit<BookingState, "departureCode">> & { departureCode?: string }) => {
      const existing = loadBookingState(departureCode);

      const next: BookingState = {
        ...(existing || FALLBACK),
        ...patch,
        departureCode: patch.departureCode ?? departureCode,
      };

      // Enrich with booker info if missing and user is logged in.
      // We only backfill so we never overwrite data already captured.
      if (!next.bookedByName && isLoggedIn) {
        next.bookedByName = profile.personal.fullName || undefined;
      }
      if (!next.bookedByEmail && isLoggedIn) {
        next.bookedByEmail = profile.personal.email || undefined;
      }
      if (!next.bookedByPhone && isLoggedIn) {
        next.bookedByPhone = profile.personal.phone || undefined;
      }

      saveBookingState(next);
      setBooking(next);
      return next;
    },
    [
      departureCode,
      isLoggedIn,
      profile.personal.email,
      profile.personal.fullName,
      profile.personal.phone,
    ]
  );

  const load = useCallback(
    () => loadBookingState(departureCode),
    [departureCode]
  );

  return { booking, save, load };
}

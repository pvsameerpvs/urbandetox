"use client";

import { type BookingState } from "@urbandetox/utils";

const STORAGE_KEY = (code: string) => `urbandetox-booking-${code}`;

export function saveBookingState(state: BookingState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY(state.departureCode), JSON.stringify(state));
}

export function loadBookingState(departureCode: string): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY(departureCode));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Removes every in-progress booking held for this browser.
 *
 * Booking state carries traveller names, phones, dates of birth, allergies,
 * medical conditions and emergency contacts, and nothing ever cleared it. On a
 * shared device the next person could open the payment page and check out
 * against whoever was still in localStorage. Called on logout, alongside the
 * profile clear.
 */
export function clearAllBookingState() {
  if (typeof window === "undefined") return;
  try {
    const prefix = STORAGE_KEY("");
    const doomed: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) doomed.push(key);
    }
    doomed.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Private browsing can refuse storage access; nothing else to do.
  }
}

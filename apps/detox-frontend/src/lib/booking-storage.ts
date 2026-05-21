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

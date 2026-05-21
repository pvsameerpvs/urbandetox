import { type BookingState } from "@urbandetox/utils";

const STORAGE_PREFIX = "urbandetox-booking-";

export interface BookingWithMeta extends BookingState {
  id: string;
  primaryName: string;
  primaryPhone: string;
  primaryEmail: string;
  travelerCount: number;
  packageSlug?: string;
  packageTitle?: string;
  destinationName?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
}

export const bookingsApi = {
  getAll(): BookingState[] {
    if (typeof window === "undefined") return [];
    const bookings: BookingState[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) bookings.push(JSON.parse(raw));
        } catch {
          // skip corrupted entries
        }
      }
    }
    return bookings;
  },

  getByCode(departureCode: string): BookingState | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${departureCode}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
} as const;

export type { BookingState };

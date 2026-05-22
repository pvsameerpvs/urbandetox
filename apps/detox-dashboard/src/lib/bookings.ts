import { fetchBookings } from "@/lib/api";
import type { BookingState } from "@urbandetox/utils";

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

function toBookingState(raw: unknown): BookingState {
  const r = raw as Record<string, unknown>;
  const details = (r.details as Record<string, unknown>) || {};

  const travelers = Array.isArray(details.travelers)
    ? details.travelers
    : r.fullName
    ? [
        {
          id: "t-1",
          type: "primary" as const,
          name: String(r.fullName || ""),
          phone: String(r.phone || ""),
          email: String(r.email || ""),
          dateOfBirth: "",
          gender: "",
          foodPreference: "",
          allergies: "",
          medicalConditions: "",
          bloodGroup: "",
          photoUrl: "",
          emergencyName: "",
          emergencyPhone: "",
          emergencyRelation: "",
        },
      ]
    : [];

  return {
    departureCode: String(r.departureCode || ""),
    travelers,
    common: {
      groupNote: String((details.common as Record<string, string>)?.groupNote || ""),
      modeOfArrival: String((details.common as Record<string, string>)?.modeOfArrival || ""),
      needsTravelHelp: Boolean((details.common as Record<string, boolean>)?.needsTravelHelp),
    },
    onboardingComplete: Boolean(details.onboardingComplete),
    paymentStatus: (r.paymentStatus as BookingState["paymentStatus"]) || "pending",
    paymentMethod: (details.paymentMethod as BookingState["paymentMethod"]) || undefined,
    bookedByName: String(details.bookedByName || r.fullName || ""),
    bookedByEmail: String(details.bookedByEmail || r.email || ""),
    bookedByPhone: String(details.bookedByPhone || r.phone || ""),
  };
}

export async function getAllBookings(): Promise<BookingState[]> {
  const raw = await fetchBookings<Record<string, unknown>>();
  return raw.map(toBookingState);
}

export async function getBooking(departureCode: string): Promise<BookingState | null> {
  try {
    const all = await getAllBookings();
    return all.find((b) => b.departureCode === departureCode) || null;
  } catch {
    return null;
  }
}

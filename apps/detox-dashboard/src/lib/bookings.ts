import { fetchBookings } from "@/lib/api";
import type { BookingState } from "@urbandetox/utils";

export interface BookingWithMeta extends BookingState {
  id: string;
  bookingStatus: string;
  primaryName: string;
  primaryPhone: string;
  primaryEmail: string;
  travelerCount: number;
  payment?: {
    razorpayPaymentId: string;
    amountPaise: number;
    amountRefundedPaise: number;
    currency: string;
    status: string;
    method?: string;
    createdAt?: string;
  } | null;
  packageSlug?: string;
  packageTitle?: string;
  destinationName?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
}

function toBookingState(raw: unknown): BookingWithMeta {
  const r = raw as Record<string, unknown>;
  const details = (r.details as Record<string, unknown>) || {};
  const rawPayment = r.payment as Record<string, unknown> | null | undefined;

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

  const primary = travelers.find((traveler) => traveler.type === "primary");

  return {
    id: String(r.id || ""),
    bookingStatus: String(r.status || "confirmed"),
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
    primaryName: String(primary?.name || r.fullName || ""),
    primaryPhone: String(primary?.phone || r.phone || ""),
    primaryEmail: String(primary?.email || r.email || ""),
    travelerCount: Number(r.travelers || travelers.length),
    payment: rawPayment
      ? {
          razorpayPaymentId: String(rawPayment.razorpayPaymentId || ""),
          amountPaise: Number(rawPayment.amountPaise || 0),
          amountRefundedPaise: Number(rawPayment.amountRefundedPaise || 0),
          currency: String(rawPayment.currency || "INR"),
          status: String(rawPayment.status || ""),
          method: rawPayment.method ? String(rawPayment.method) : undefined,
          createdAt: rawPayment.createdAt
            ? String(rawPayment.createdAt)
            : undefined,
        }
      : null,
  };
}

export async function getAllBookings(): Promise<BookingWithMeta[]> {
  const raw = await fetchBookings<Record<string, unknown>>();
  return raw.map(toBookingState);
}

export async function getBooking(bookingId: string): Promise<BookingWithMeta | null> {
  try {
    const all = await getAllBookings();
    return all.find((b) => b.id === bookingId) || null;
  } catch {
    return null;
  }
}

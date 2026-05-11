"use client";

export interface Traveler {
  id: string;
  type: "primary" | "companion";
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  foodPreference: string;
  allergies: string;
  medicalConditions: string;
  bloodGroup: string;
  photoUrl: string;
  idUrl: string;
  idType: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
}

export interface CommonDetails {
  groupNote: string;
  modeOfArrival: string;
  needsTravelHelp: boolean;
}

export interface BookingState {
  departureCode: string;
  travelers: Traveler[];
  common: CommonDetails;
  onboardingComplete?: boolean;
  paymentStatus?: "paid" | "pending" | "cod";
  paymentMethod?: "razorpay" | "cod";
}

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

const STORAGE_PREFIX = "urbandetox-booking-";

export function getAllBookings(): BookingState[] {
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
}

export function getBooking(departureCode: string): BookingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${departureCode}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Shared booking domain types.
 *
 * Used by both detox-frontend and detox-dashboard so they
 * speak the same language. This is the single source of truth
 * for anything stored under the `urbandetox-booking-*` localStorage
 * prefix.
 */

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
  idUrl?: string;
  idType?: string;
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
  paymentStatus?: "paid" | "pending" | "cod" | "refunded";
  paymentMethod?: "razorpay" | "cod";
  bookingId?: string;
  checkoutSessionId?: string;
  checkoutIdempotencyKey?: string;
  paymentConfirmationPending?: boolean;
  /** Account holder who initiated the booking (may differ from primary traveler). */
  bookedByName?: string;
  bookedByEmail?: string;
  bookedByPhone?: string;
}

/** Dashboard-enriched view that decorates a raw BookingState with trip metadata. */
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

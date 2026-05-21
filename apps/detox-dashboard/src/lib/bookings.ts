"use client";

import { type BookingState } from "@urbandetox/utils";
import { bookingsApi } from "@/features/bookings";

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

export function getAllBookings(): BookingState[] {
  return bookingsApi.getAll();
}

export function getBooking(departureCode: string): BookingState | null {
  return bookingsApi.getByCode(departureCode);
}

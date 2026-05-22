import { type BookingState } from "@urbandetox/utils";
import { fetchBookings } from "@/lib/api";

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

export async function getAllBookings(): Promise<BookingState[]> {
  return fetchBookings<BookingState>();
}

export async function getBooking(departureCode: string): Promise<BookingState | null> {
  try {
    const all = await getAllBookings();
    return all.find((b) => b.departureCode === departureCode) || null;
  } catch {
    return null;
  }
}

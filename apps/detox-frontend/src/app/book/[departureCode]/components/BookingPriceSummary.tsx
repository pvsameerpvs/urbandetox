"use client";

import { BookingSummaryCard } from "../../components/BookingSummaryCard";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { format } from "date-fns";
import type { Package } from "@/lib/types";
import type { Destination } from "@urbandetox/utils";
import type { Departure } from "@/lib/types";

interface BookingPriceSummaryProps {
  pkg: Package;
  dest: Destination;
  departure: Departure;
  selectedDate: Date | undefined;
  selectedDeparture: { status: string; seatsLeft: number; code: string; price: number; offerPrice?: number } | null;
  travelerCount: number;
  totalPrice: number;
  gst: number;
  grandTotal: number;
}

export function BookingPriceSummary({ pkg, dest, departure, selectedDate, selectedDeparture, travelerCount, totalPrice, gst, grandTotal }: BookingPriceSummaryProps) {
  const dates = selectedDate && selectedDeparture
    ? formatDateRange(format(selectedDate, "yyyy-MM-dd"), format(selectedDate, "yyyy-MM-dd"))
    : formatDateRange(departure.startDate, departure.endDate);

  const availableSeatCount = selectedDeparture?.seatsLeft ?? departure.seatsLeft;

  const priceLines = [
    { label: `Price × ${travelerCount} person${travelerCount > 1 ? "s" : ""}`, value: formatPrice(totalPrice) },
    { label: "GST (5%)", value: formatPrice(gst) },
    { label: "Total", value: formatPrice(grandTotal), isTotal: true },
  ];

  return (
    <BookingSummaryCard
      image={pkg.coverImage}
      title={pkg.title}
      destination={dest.name}
      durationLabel={pkg.durationLabel}
      dates={dates}
      meetingPoint={dest.meetingPoint}
      travelers={travelerCount}
      seatsLeft={availableSeatCount}
      priceLines={priceLines}
      total={grandTotal}
    />
  );
}

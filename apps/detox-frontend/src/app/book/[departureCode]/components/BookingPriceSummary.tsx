"use client";

import { BookingSummaryCard } from "../../components/BookingSummaryCard";
import { formatPrice, formatDateRange, safeImageUrl } from "@urbandetox/utils";
import { format } from "date-fns";
import type { Package } from "@urbandetox/utils";
import type { Destination } from "@urbandetox/utils";
import type { Departure } from "@urbandetox/utils";
import { type AvailableDateOption } from "./date-options";

interface BookingPriceSummaryProps {
  pkg: Package;
  dest: Destination;
  departure: Departure;
  selectedDate: Date | undefined;
  selectedDeparture: AvailableDateOption | null;
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
      image={safeImageUrl(pkg.coverImage)}
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

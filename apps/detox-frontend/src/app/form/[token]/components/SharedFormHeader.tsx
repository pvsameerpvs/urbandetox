import { CalendarDays, MapPin } from "lucide-react";
import { formatDateRange } from "@urbandetox/utils";

interface SharedFormHeaderProps {
  departureCode: string;
  startDate?: string;
  endDate?: string;
  travelerCount: number;
}

export function SharedFormHeader({
  departureCode,
  startDate,
  endDate,
  travelerCount,
}: SharedFormHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-sidebar-dark">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-4 inline-flex items-center gap-3">
          <div className="h-px w-8 bg-white/40" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Traveller Details
          </span>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
          Tell us who is travelling
        </h1>
        <p className="mb-5 max-w-lg text-sm text-white/60">
          We use this to arrange your stay, food and pickup. You can close this
          page and come back to the same link.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/70">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {departureCode}
          </span>
          {startDate && endDate && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDateRange(startDate, endDate)}
            </span>
          )}
          <span>
            {travelerCount} {travelerCount === 1 ? "traveller" : "travellers"}
          </span>
        </div>
      </div>
    </div>
  );
}

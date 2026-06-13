"use client";

import Link from "next/link";
import { Card, CardContent } from "@urbandetox/ui";
import {
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  CalendarDays,
} from "lucide-react";
import { PaymentBadge } from "@/components/ui/PaymentBadge";
import type { BookingWithMeta } from "@/lib/bookings";

interface PackageBookingsProps {
  bookings: BookingWithMeta[];
}

export function PackageBookings({ bookings }: PackageBookingsProps) {
  if (bookings.length === 0) {
    return (
      <Card className="border border-border/40 rounded-2xl bg-white">
        <CardContent className="p-8 text-center">
          <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-3">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-bold">No bookings yet</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Bookings appear here when customers complete checkout.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <Card key={b.id} className="border border-border/40 rounded-2xl bg-white hover:border-brand/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-brand">{b.primaryName?.charAt(0)?.toUpperCase() || "?"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-medium">{b.primaryName || "—"}</p>
                  <PaymentBadge status={b.paymentStatus} />
                  {b.onboardingComplete ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" /> Complete
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {b.travelerCount} traveler{b.travelerCount !== 1 ? "s" : ""}
                  </span>
                  <span>{b.departureCode}</span>
                  <span>{b.startDate} → {b.endDate}</span>
                </div>
              </div>
              <Link
                href={`/bookings/${b.id}`}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand/80 transition-colors shrink-0"
              >
                View <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


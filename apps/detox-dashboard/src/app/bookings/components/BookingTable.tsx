"use client";

import Link from "next/link";
import { Card, CardContent } from "@urbandetox/ui";
import { Badge } from "@urbandetox/ui";
import {
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@urbandetox/utils";
import { PaymentBadge } from "@/components/admin/PaymentBadge";
import type { BookingWithMeta } from "@/lib/bookings";

interface BookingTableProps {
  bookings: BookingWithMeta[];
}

export function BookingTable({ bookings }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <Card className="border border-border/40 rounded-2xl bg-white">
        <CardContent className="p-12 text-center">
          <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold">No bookings yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Bookings appear here when customers complete onboarding on the frontend. Try booking a trip from the customer site.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40 rounded-2xl bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-secondary/[0.03]">
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Customer</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Booked By</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Trip</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Dates</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Travelers</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Payment</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className={cn(
                  "border-b border-border/20 transition-colors",
                  "hover:bg-brand/[0.02]"
                )}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-brand">{b.primaryName?.charAt(0)?.toUpperCase() || "?"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs truncate">{b.primaryName || "—"}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{b.primaryPhone || b.primaryEmail || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="font-medium text-xs truncate">{b.bookedByName || "Guest"}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{b.bookedByPhone || b.bookedByEmail || "—"}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{b.packageTitle || "—"}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{b.destinationName || "—"}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="text-xs">
                    <p className="font-medium">{b.startDate || "—"}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <ArrowRight className="h-3 w-3" /> {b.endDate || "—"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant="outline" className="text-[10px] h-5 border-border/40">
                    <Users className="h-3 w-3 mr-1" />
                    {b.travelerCount}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <PaymentBadge status={b.paymentStatus} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col gap-1">
                    {b.onboardingComplete ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" /> Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground font-mono">{b.departureCode}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link
                    href={`/bookings/${b.departureCode}`}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand/80 transition-colors"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}



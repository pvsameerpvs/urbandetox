"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Card, CardContent, Badge } from "@urbandetox/ui";
import {
  ArrowLeft,
  Car,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  Shield,
  NotebookPen,
  Users,
  Calendar,
} from "lucide-react";
import { getBooking } from "@/lib/bookings";
import { getDepartureByCode, getPackageBySlug, getDestinationBySlug } from "@/lib/admin-data";
import { InfoBlock } from "./components/InfoBlock";
import { PaymentInfoBlock } from "./components/PaymentInfoBlock";
import { PaymentDetailsCard } from "./components/PaymentDetailsCard";
import { TravelerDetailCard } from "./components/TravelerDetailCard";

export default function BookingDetailPage() {
  const params = useParams();
  const code = String(params.departureCode);

  const booking = getBooking(code);
  if (!booking) notFound();

  const departure = getDepartureByCode(code);
  const pkg = departure ? getPackageBySlug(departure.packageSlug) : undefined;
  const dest = departure ? getDestinationBySlug(departure.destinationSlug) : undefined;

  const primary = booking.travelers.find((t) => t.type === "primary");
  const companions = booking.travelers.filter((t) => t.type === "companion");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/bookings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Bookings
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
          {booking.onboardingComplete ? (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] h-5">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] h-5">
              <Clock className="h-3 w-3 mr-1" /> Pending
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Departure <span className="font-mono font-medium text-foreground">{code}</span> · {booking.travelers.length} traveler{booking.travelers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Trip Overview */}
      <Card className="border border-border/40 rounded-2xl overflow-hidden">
        <div className="h-2 bg-brand" />
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
              <Package className="h-6 w-6 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base">{pkg?.title || "Unknown Package"}</p>
              <p className="text-sm text-muted-foreground">{pkg?.subtitle || ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-5 pt-4 border-t border-border/30">
            <InfoBlock icon={<MapPin className="h-4 w-4 text-brand" />} label="Destination" value={dest?.name || "—"} />
            <InfoBlock icon={<Calendar className="h-4 w-4 text-brand" />} label="Start Date" value={departure?.startDate || "—"} />
            <InfoBlock icon={<Calendar className="h-4 w-4 text-brand" />} label="End Date" value={departure?.endDate || "—"} />
            <InfoBlock icon={<Shield className="h-4 w-4 text-brand" />} label="Departure Code" value={departure?.code || "—"} />
            <PaymentInfoBlock status={booking.paymentStatus} method={booking.paymentMethod} />
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <PaymentDetailsCard
        status={booking.paymentStatus}
        method={booking.paymentMethod}
        departure={departure}
        travelerCount={booking.travelers.length}
      />

      {/* Group Details */}
      {booking.common && (booking.common.modeOfArrival || booking.common.groupNote || booking.common.needsTravelHelp) && (
        <Card className="border border-border/40 rounded-2xl">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <NotebookPen className="h-4 w-4" /> Group Details
            </h3>
            {booking.common.modeOfArrival && (
              <div className="flex items-center gap-3 text-sm">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Arrival mode:</span>
                <span className="font-medium">{booking.common.modeOfArrival}</span>
              </div>
            )}
            {booking.common.needsTravelHelp && (
              <div className="flex items-center gap-3 text-sm text-brand">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">Needs travel help arranged</span>
              </div>
            )}
            {booking.common.groupNote && (
              <div className="pt-3 border-t border-border/30">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Group Note</p>
                <p className="text-sm bg-secondary/30 rounded-lg p-3">{booking.common.groupNote}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Travelers */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <Users className="h-4 w-4" /> Travelers ({booking.travelers.length})
        </h3>
        <div className="space-y-4">
          {primary && <TravelerDetailCard traveler={primary} isPrimary index={0} />}
          {companions.map((c, i) => (
            <TravelerDetailCard key={c.id} traveler={c} isPrimary={false} index={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

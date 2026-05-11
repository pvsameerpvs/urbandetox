"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Card, CardContent, Badge } from "@urbandetox/ui";
import {
  ArrowLeft,
  User,
  Users,
  Phone,
  Mail,
  Calendar,
  Utensils,
  HeartPulse,
  Droplets,
  AlertTriangle,
  Car,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  Shield,
  Contact,
  NotebookPen,
} from "lucide-react";
import { getBooking } from "@/lib/bookings";
import { getDepartureByCode, getPackageBySlug, getDestinationBySlug } from "@/lib/admin-data";

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/bookings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Bookings
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
        <p className="text-sm text-muted-foreground mt-1">{code} · {booking.travelers.length} traveler{booking.travelers.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Trip Info */}
      <Card className="border border-border/40 rounded-2xl bg-gradient-to-br from-brand/[0.03] to-transparent">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base">{pkg?.title || "Unknown Package"}</p>
              <p className="text-sm text-muted-foreground">{pkg?.subtitle || ""}</p>
            </div>
            {booking.onboardingComplete ? (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">
                <Clock className="h-3 w-3 mr-1" /> Pending
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Destination</p>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand" />
                <span className="font-medium">{dest?.name || "—"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Start Date</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-brand" />
                <span className="font-medium">{departure?.startDate || "—"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">End Date</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-brand" />
                <span className="font-medium">{departure?.endDate || "—"}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Departure Code</p>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-brand" />
                <span className="font-medium font-mono">{departure?.code || "—"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Group Details */}
      {booking.common && (booking.common.modeOfArrival || booking.common.groupNote || booking.common.needsTravelHelp) && (
        <Card className="border border-border/40 rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <NotebookPen className="h-3.5 w-3.5" /> Group Details
            </h3>
            {booking.common.modeOfArrival && (
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Arrival mode:</span>
                <span className="font-medium">{booking.common.modeOfArrival}</span>
              </div>
            )}
            {booking.common.needsTravelHelp && (
              <div className="flex items-center gap-2 text-sm text-brand">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">Needs travel help</span>
              </div>
            )}
            {booking.common.groupNote && (
              <div className="pt-2 border-t border-border/30">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Group Note</p>
                <p className="text-sm text-foreground bg-secondary/30 rounded-lg p-3">{booking.common.groupNote}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Travelers */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> Travelers ({booking.travelers.length})
        </h3>
        <div className="space-y-4">
          {primary && <TravelerDetail traveler={primary} isPrimary />}
          {companions.map((c) => (
            <TravelerDetail key={c.id} traveler={c} isPrimary={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TravelerDetail({ traveler, isPrimary }: { traveler: { name: string; phone: string; email: string; dateOfBirth: string; gender: string; foodPreference: string; allergies: string; medicalConditions: string; bloodGroup: string; emergencyName: string; emergencyPhone: string; emergencyRelation: string; type: string }; isPrimary: boolean }) {
  return (
    <Card className="border border-border/40 rounded-2xl overflow-hidden">
      <div className={`h-1.5 ${isPrimary ? "bg-brand" : "bg-secondary"}`} />
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isPrimary ? "bg-brand/10" : "bg-secondary"}`}>
            <User className={`h-5 w-5 ${isPrimary ? "text-brand" : "text-muted-foreground"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">{traveler.name || "—"}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{isPrimary ? "Primary Traveler" : "Companion"}</p>
          </div>
          {traveler.gender && (
            <Badge variant="outline" className="text-[10px] h-5 border-border/40">
              {traveler.gender}
            </Badge>
          )}
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoItem icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={traveler.phone} />
          <InfoItem icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={traveler.email} />
          <InfoItem icon={<Calendar className="h-3.5 w-3.5" />} label="Date of Birth" value={traveler.dateOfBirth} />
          <InfoItem icon={<Droplets className="h-3.5 w-3.5" />} label="Blood Group" value={traveler.bloodGroup} />
        </div>

        {/* Health */}
        <div className="pt-3 border-t border-border/30 space-y-2">
          <InfoItem icon={<Utensils className="h-3.5 w-3.5" />} label="Food Preference" value={traveler.foodPreference} />
          {traveler.allergies && (
            <div className="flex items-start gap-2 text-sm text-amber-600">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Allergies</p>
                <p className="text-xs">{traveler.allergies}</p>
              </div>
            </div>
          )}
          {traveler.medicalConditions && (
            <div className="flex items-start gap-2 text-sm text-red-500">
              <HeartPulse className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Medical Conditions</p>
                <p className="text-xs">{traveler.medicalConditions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Emergency */}
        {(traveler.emergencyName || traveler.emergencyPhone) && (
          <div className="pt-3 border-t border-border/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Emergency Contact</p>
            <div className="flex items-center gap-2 text-sm">
              <Contact className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{traveler.emergencyName || "—"}</span>
              {traveler.emergencyRelation && (
                <Badge variant="outline" className="text-[10px] h-4 border-border/40">{traveler.emergencyRelation}</Badge>
              )}
            </div>
            {traveler.emergencyPhone && (
              <div className="flex items-center gap-2 text-sm mt-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{traveler.emergencyPhone}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-medium pl-5">{value || "—"}</p>
    </div>
  );
}

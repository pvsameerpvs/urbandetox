"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, Badge } from "@urbandetox/ui";
import {
  ArrowLeft,
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
  Camera,
  FileText,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { getBooking } from "@/lib/bookings";
import { getDepartureByCode, getPackageBySlug, getDestinationBySlug } from "@/lib/admin-data";
import { safeImageUrl } from "@urbandetox/utils";

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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-border/30">
            <InfoBlock icon={<MapPin className="h-4 w-4 text-brand" />} label="Destination" value={dest?.name || "—"} />
            <InfoBlock icon={<Calendar className="h-4 w-4 text-brand" />} label="Start Date" value={departure?.startDate || "—"} />
            <InfoBlock icon={<Calendar className="h-4 w-4 text-brand" />} label="End Date" value={departure?.endDate || "—"} />
            <InfoBlock icon={<Shield className="h-4 w-4 text-brand" />} label="Departure Code" value={departure?.code || "—"} />
          </div>
        </CardContent>
      </Card>

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

function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-medium pl-5">{value}</p>
    </div>
  );
}

function TravelerDetailCard({ traveler, isPrimary, index }: { traveler: { name: string; phone: string; email: string; dateOfBirth: string; gender: string; foodPreference: string; allergies: string; medicalConditions: string; bloodGroup: string; photoUrl: string; idUrl: string; idType: string; emergencyName: string; emergencyPhone: string; emergencyRelation: string; type: string }; isPrimary: boolean; index: number }) {
  const hasPhoto = traveler.photoUrl && traveler.photoUrl.startsWith("http");
  const hasId = traveler.idUrl && traveler.idUrl.startsWith("http");
  const [showPhoto, setShowPhoto] = useState(false);

  return (
    <>
      <Card className="border border-border/40 rounded-2xl overflow-hidden">
        <div className={`h-1.5 ${isPrimary ? "bg-brand" : "bg-secondary"}`} />
        <CardContent className="p-5 space-y-5">
          {/* Photo + Header */}
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              {hasPhoto ? (
                <button
                  onClick={() => setShowPhoto(true)}
                  className="h-16 w-16 rounded-xl overflow-hidden bg-secondary hover:ring-2 hover:ring-brand/40 transition-all cursor-pointer"
                >
                  <Image src={safeImageUrl(traveler.photoUrl)} alt={traveler.name} width={64} height={64} className="h-full w-full object-cover" />
                </button>
              ) : (
                <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${isPrimary ? "bg-brand/10" : "bg-secondary"}`}>
                  <User className={`h-8 w-8 ${isPrimary ? "text-brand" : "text-muted-foreground"}`} />
                </div>
              )}
            </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-base">{traveler.name || `Traveler ${index + 1}`}</p>
              <Badge variant="outline" className={`text-[10px] h-5 ${isPrimary ? "border-brand/30 text-brand" : "border-border/40"}`}>
                {isPrimary ? "Primary" : "Companion"}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {traveler.gender && <span className="text-xs text-muted-foreground">{traveler.gender}</span>}
              {traveler.bloodGroup && (
                <span className="text-xs flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-brand" /> {traveler.bloodGroup}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${hasPhoto ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            <Camera className="h-3.5 w-3.5" />
            <span className="font-medium">Photo {hasPhoto ? "Uploaded" : "Pending"}</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${hasId ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            <FileText className="h-3.5 w-3.5" />
            <span className="font-medium">{traveler.idType || "ID"} {hasId ? "Uploaded" : "Pending"}</span>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={traveler.phone} />
          <DetailRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={traveler.email} />
          <DetailRow icon={<Calendar className="h-3.5 w-3.5" />} label="Date of Birth" value={traveler.dateOfBirth} />
          <DetailRow icon={<Utensils className="h-3.5 w-3.5" />} label="Food Preference" value={traveler.foodPreference} />
        </div>

        {/* Health */}
        <div className="pt-3 border-t border-border/30 space-y-2">
          {traveler.allergies && traveler.allergies !== "None" && (
            <div className="flex items-start gap-2 text-sm text-amber-600">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Allergies: </span>
                <span>{traveler.allergies}</span>
              </div>
            </div>
          )}
          {traveler.medicalConditions && traveler.medicalConditions !== "None" && (
            <div className="flex items-start gap-2 text-sm text-red-500">
              <HeartPulse className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Medical: </span>
                <span>{traveler.medicalConditions}</span>
              </div>
            </div>
          )}
        </div>

        {/* Emergency */}
        {(traveler.emergencyName || traveler.emergencyPhone) && (
          <div className="pt-3 border-t border-border/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <Contact className="h-3.5 w-3.5" /> Emergency Contact
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{traveler.emergencyName || "—"}</span>
              {traveler.emergencyRelation && (
                <Badge variant="outline" className="text-[10px] h-4 border-border/40">{traveler.emergencyRelation}</Badge>
              )}
            </div>
            {traveler.emergencyPhone && (
              <div className="flex items-center gap-2 text-sm mt-1 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{traveler.emergencyPhone}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>

    {/* Photo Lightbox */}
    {showPhoto && hasPhoto && (
      <div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        onClick={() => setShowPhoto(false)}
      >
        <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <p className="font-semibold text-sm">{traveler.name} — Photo</p>
            <button
              onClick={() => setShowPhoto(false)}
              className="text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              Close
            </button>
          </div>
          <div className="p-4">
            <Image
              src={safeImageUrl(traveler.photoUrl)}
              alt={traveler.name}
              width={400}
              height={400}
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    )}
  </>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}

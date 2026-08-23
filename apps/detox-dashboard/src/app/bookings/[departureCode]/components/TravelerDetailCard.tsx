"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, Badge } from "@urbandetox/ui";
import {
  Phone,
  Mail,
  Calendar,
  Utensils,
  HeartPulse,
  Droplets,
  AlertTriangle,
  Contact,
  Camera,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import { safeImageUrl, type Traveler } from "@urbandetox/utils";
import { DetailRow } from "./DetailRow";

interface TravelerDetailCardProps {
  traveler: Traveler;
  isPrimary: boolean;
  index: number;
}

export function TravelerDetailCard({ traveler, isPrimary, index }: TravelerDetailCardProps) {
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
            {hasId ? (
              <a
                href={traveler.idUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="font-medium">View {traveler.idType || "ID"}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-amber-50 text-amber-700">
                <FileText className="h-3.5 w-3.5" />
                <span className="font-medium">{traveler.idType || "ID"} Pending</span>
              </div>
            )}
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

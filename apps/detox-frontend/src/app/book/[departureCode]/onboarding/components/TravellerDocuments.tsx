"use client";

import type { Traveler } from "@urbandetox/utils";
import { DocumentUpload } from "@/components/documents/DocumentUpload";

interface TravellerDocumentsProps {
  travelers: Traveler[];
  bookingId?: string;
  onUpdate: (index: number, patch: Partial<Traveler>) => void;
}

/**
 * Photo and ID capture for signed-in travellers.
 *
 * The share-link form has had this since it was built; the logged-in
 * onboarding shipped a "Choose File" button with no handler attached, so the
 * upload silently did nothing. Traveler already carries photoUrl, idUrl and
 * idType, and the onboarding PUT persists the whole travellers array, so
 * nothing new has to be stored.
 */
export function TravellerDocuments({ travelers, bookingId, onUpdate }: TravellerDocumentsProps) {
  if (!bookingId) {
    return (
      <p className="rounded-xl bg-secondary/30 p-4 text-xs text-muted-foreground">
        Documents can be added once your booking is confirmed. You will get a
        link, and you can also send them to us on WhatsApp.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {travelers.map((t, i) => (
        <div key={t.id} className="rounded-2xl border border-border/60 p-4">
          <p className="mb-3 text-xs font-semibold">
            {t.name?.trim() || (t.type === "primary" ? "Lead traveller" : `Traveller ${i + 1}`)}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DocumentUpload
              label="Passport-size photo"
              kind="photo"
              bookingId={bookingId}
              value={t.photoUrl || undefined}
              onUploaded={(path) => onUpdate(i, { photoUrl: path })}
            />
            <DocumentUpload
              label="Government ID (Aadhaar, passport or DL)"
              hint="Held privately, never shown publicly"
              kind="id"
              bookingId={bookingId}
              value={t.idUrl || undefined}
              onUploaded={(path) => onUpdate(i, { idUrl: path, idType: t.idType || "ID" })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
;
;
;
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import { useUserProfile } from "@/lib/user-profile";
import { FileText, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { Card, CardContent, Button, Badge } from "@urbandetox/ui"

const statusConfig = {
  missing: { icon: AlertCircle, label: "Missing", className: "bg-muted text-muted-foreground" },
  uploaded: { icon: CheckCircle2, label: "Uploaded", className: "bg-emerald-100 text-emerald-700" },
  verified: { icon: Shield, label: "Verified", className: "bg-brand/10 text-brand" },
};

export default function DocumentsPage() {
  const { profile } = useUserProfile();
  const docs = profile.documents;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6 sm:p-8">
          <ProfileSectionHeader
            icon={FileText}
            title="Documents"
            description="Upload required documents for your trips. These are reused across all your bookings."
          />

          <div className="space-y-4">
            {docs.map((doc) => {
              const StatusIcon = statusConfig[doc.status].icon;
              return (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-secondary/30 p-5 sm:p-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm">{doc.label}</h4>
                      <Badge className={`${statusConfig[doc.status].className} border-0 text-[10px]`}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[doc.status].label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{doc.description}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{doc.hint}</p>
                  </div>

                  {/*
                    There used to be an "Upload" button here that took no file:
                    it flipped a localStorage flag and then displayed "File
                    ready", so a traveller could reasonably believe their
                    Aadhaar was on record when nothing had been sent. Documents
                    are held against a specific booking (see
                    services/private-storage.ts, keyed by bookingId), so a
                    profile page has nothing legitimate to upload to. It points
                    at the trip instead, where the upload actually works.
                  */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      asChild
                      variant="outline"
                      className="h-10 rounded-xl px-4 text-xs font-semibold"
                    >
                      <Link href="/my-detox">Add on your trip</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-brand/5 p-4">
            <Shield className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your documents are encrypted and stored securely. We only access them for trip verification and emergency purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

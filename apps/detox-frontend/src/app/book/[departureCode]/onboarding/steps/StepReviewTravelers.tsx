"use client";

;
;
import { User, Phone } from "lucide-react";
import type { Traveler } from "@urbandetox/utils";
import { Label, Input } from "@urbandetox/ui"

interface StepReviewTravelersProps {
  travelers: Traveler[];
  onUpdate: (index: number, data: Partial<Traveler>) => void;
}

export function StepReviewTravelers({ travelers, onUpdate }: StepReviewTravelersProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Review and edit each traveler&apos;s details. Food preferences are critical for meal planning.</p>
      {travelers.map((t, i) => (
        <div key={t.id} className="rounded-2xl bg-secondary/20 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center rounded-xl h-8 w-8 bg-brand/10 text-brand text-xs font-bold">{i + 1}</div>
              <div>
                <p className="text-sm font-bold">{t.name || `Traveler ${i + 1}`}</p>
                <p className="text-xs text-muted-foreground">{t.type === "primary" ? "Primary" : "Companion"}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={t.name} onChange={(e) => onUpdate(i, { name: e.target.value })} className="h-12 pl-11 rounded-xl bg-white border-0 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={t.phone} onChange={(e) => onUpdate(i, { phone: e.target.value })} className="h-12 pl-11 rounded-xl bg-white border-0 text-sm" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

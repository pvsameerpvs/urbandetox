"use client";

;
;
;
import type { Traveler } from "@/lib/booking-state";
import { Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui"

interface StepHealthFoodProps {
  travelers: Traveler[];
  onUpdate: (index: number, data: Partial<Traveler>) => void;
}

export function StepHealthFood({ travelers, onUpdate }: StepHealthFoodProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Each traveler&apos;s food and health info helps us prepare meals and handle emergencies safely.</p>
      {travelers.map((t, i) => (
        <div key={t.id} className="rounded-2xl bg-secondary/20 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center rounded-xl h-8 w-8 bg-brand/10 text-brand text-xs font-bold">{i + 1}</div>
            <p className="text-sm font-bold">{t.name || `Traveler ${i + 1}`}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Food Preference</Label>
              <Select value={t.foodPreference} onValueChange={(v) => onUpdate(i, { foodPreference: v ?? "vegetarian" })}>
                <SelectTrigger className="h-12 rounded-xl bg-white border-0 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["vegetarian", "vegan", "non-vegetarian", "jain", "no-preference"].map((v) => (
                    <SelectItem key={v} value={v}>{v.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Allergies</Label>
              <Input value={t.allergies} onChange={(e) => onUpdate(i, { allergies: e.target.value })} placeholder="None / Nuts" className="h-12 rounded-xl bg-white border-0 text-sm" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-sm font-semibold">Medical Conditions</Label>
              <Input value={t.medicalConditions} onChange={(e) => onUpdate(i, { medicalConditions: e.target.value })} placeholder="None / Asthma / Diabetes" className="h-12 rounded-xl bg-white border-0 text-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

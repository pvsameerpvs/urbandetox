"use client";

import { useFormContext } from "react-hook-form";
import { User, Phone, Heart } from "lucide-react";
import type { Traveler } from "@urbandetox/utils";
import { Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui";
import type { OnboardingFormValues } from "@/lib/onboarding-schema";

interface StepEmergencyContactsProps {
  travelers: Traveler[];
  onUpdate: (index: number, data: Partial<Traveler>) => void;
  common: {
    groupNote: string;
  };
  onUpdateCommon: (d: { groupNote: string }) => void;
}

export function StepEmergencyContacts({ travelers, onUpdate, common, onUpdateCommon }: StepEmergencyContactsProps) {
  const { formState } = useFormContext<OnboardingFormValues>();

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-brand/5 border border-brand/10 p-3">
        <p className="text-xs text-muted-foreground">
          {travelers.length > 1
            ? "Review the emergency contact for each traveler. We will reach out to them if needed."
            : "Review your emergency contact. We will reach out to them if we cannot reach you."}
        </p>
      </div>

      {travelers.map((t, i) => {
        const emergNameErr = formState.errors.travelers?.[i]?.emergencyName?.message;
        const emergPhoneErr = formState.errors.travelers?.[i]?.emergencyPhone?.message;
        const emergRelErr = formState.errors.travelers?.[i]?.emergencyRelation?.message;
        return (
          <div key={t.id} className="rounded-2xl bg-secondary/20 p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center rounded-xl h-8 w-8 bg-brand/10 text-brand text-xs font-bold">{i + 1}</div>
              <div>
                <p className="text-sm font-bold">{t.name || `Traveler ${i + 1}`}</p>
                <p className="text-xs text-muted-foreground">{t.type === "primary" ? "Primary" : "Companion"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Emergency Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={t.emergencyName}
                    onChange={(e) => onUpdate(i, { emergencyName: e.target.value })}
                    placeholder="Name"
                    className={`h-12 pl-11 rounded-xl bg-white border-0 text-sm ${emergNameErr ? "ring-2 ring-red-400" : ""}`}
                  />
                </div>
                {emergNameErr && <p className="text-red-500 text-xs mt-1">{emergNameErr}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Emergency Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={t.emergencyPhone}
                    onChange={(e) => onUpdate(i, { emergencyPhone: e.target.value })}
                    placeholder="Phone"
                    className={`h-12 pl-11 rounded-xl bg-white border-0 text-sm ${emergPhoneErr ? "ring-2 ring-red-400" : ""}`}
                  />
                </div>
                {emergPhoneErr && <p className="text-red-500 text-xs mt-1">{emergPhoneErr}</p>}
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-sm font-semibold">Relationship</Label>
                <div className="relative">
                  <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select value={t.emergencyRelation} onValueChange={(v) => onUpdate(i, { emergencyRelation: v ?? "" })}>
                    <SelectTrigger className={`h-12 pl-11 rounded-xl bg-white border-0 text-sm ${emergRelErr ? "ring-2 ring-red-400" : ""}`}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {["spouse", "parent", "sibling", "friend", "colleague", "other"].map((r) => (
                        <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {emergRelErr && <p className="text-red-500 text-xs mt-1">{emergRelErr}</p>}
              </div>
            </div>
          </div>
        );
      })}

      <div className="space-y-2">
        <Label className="text-sm font-semibold">{travelers.length > 1 ? "Group Note" : "Note"} (Optional)</Label>
        <textarea
          value={common.groupNote}
          onChange={(e) => onUpdateCommon({ groupNote: e.target.value })}
          placeholder={travelers.length > 1 ? "Anything we should know about your group?" : "Anything we should know?"}
          className="w-full min-h-[60px] rounded-xl bg-secondary/40 border-0 p-3 text-sm resize-none"
        />
      </div>
    </div>
  );
}

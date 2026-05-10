"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PrefilledBadge } from "../components/PrefilledBadge";
import { Utensils, AlertTriangle, Pill } from "lucide-react";

interface HealthProfile {
  foodPreference: string;
  allergies: string;
  medicalConditions: string;
  bloodGroup: string;
}

export function StepHealthFood({ profile }: { profile: HealthProfile }) {
  const [foodPreference, setFoodPreference] = useState(profile.foodPreference || "vegetarian");
  const [allergies, setAllergies] = useState(profile.allergies || "");
  const [medical, setMedical] = useState(profile.medicalConditions || "");
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup || "");

  const hasPrefill = !!(profile.foodPreference || profile.allergies || profile.medicalConditions || profile.bloodGroup);

  return (
    <div className="space-y-5">
      {hasPrefill && (
        <div className="flex items-center gap-2 rounded-xl bg-brand/5 border border-brand/10 p-3">
          <span className="text-lg">✨</span>
          <p className="text-xs text-muted-foreground">We&apos;ve pre-filled your health details from your profile. You can edit them below.</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Label className="text-sm font-semibold">Food Preference</Label>
          {profile.foodPreference && <PrefilledBadge />}
        </div>
        <Select value={foodPreference} onValueChange={(v) => setFoodPreference(v ?? "vegetarian")}>
          <SelectTrigger className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
            <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["vegetarian", "vegan", "non-vegetarian", "jain", "no-preference"].map((v) => (
              <SelectItem key={v} value={v}>{v.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Label htmlFor="allergies" className="text-sm font-semibold">Do you have any allergies?</Label>
          {profile.allergies && profile.allergies !== "None" && <PrefilledBadge />}
        </div>
        <div className="relative">
          <AlertTriangle className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="None / Nuts / Shellfish / Gluten" className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Label htmlFor="medical" className="text-sm font-semibold">Do you have any medical conditions?</Label>
          {profile.medicalConditions && profile.medicalConditions !== "None" && <PrefilledBadge />}
        </div>
        <div className="relative">
          <Pill className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="medical" value={medical} onChange={(e) => setMedical(e.target.value)} placeholder="None / Asthma / Diabetes / Blood Pressure" className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Label className="text-sm font-semibold">Blood Group</Label>
          {profile.bloodGroup && <PrefilledBadge />}
        </div>
        <Select value={bloodGroup} onValueChange={(v) => setBloodGroup(v ?? "")}>
          <SelectTrigger className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 w-full sm:w-[140px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Not sure</SelectItem>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

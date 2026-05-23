"use client";

import { useState } from "react";
import { motion } from "framer-motion";
;
;
;
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import { IconInput } from "../components/IconInput";
import { SaveButton } from "../components/SaveButton";
import { useUserProfile } from "@/lib/user-profile";
import { Heart, Utensils, AlertTriangle, Pill, Droplets } from "lucide-react";
import { Card, CardContent, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui"

const foodOptions = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "non-vegetarian", label: "Non-Vegetarian" },
  { value: "jain", label: "Jain" },
  { value: "no-preference", label: "No Preference" },
];

const bloodOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function PreferencesPage() {
  const { profile, updateHealth } = useUserProfile();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6 sm:p-8">
          <ProfileSectionHeader
            icon={Heart}
            title="Preferences"
            description="Dietary needs, allergies, and medical info. Saved here and auto-filled during trip onboarding."
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Food Preference</label>
                <div className="relative">
                  <Utensils className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                  <Select
                    value={profile.health.foodPreference}
                    onValueChange={(v) => updateHealth({ foodPreference: v ?? "" })}
                  >
                    <SelectTrigger className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {foodOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {profile.health.foodPreference && (
                  <Badge variant="outline" className="border-brand/30 text-brand text-[10px] font-medium">
                    Auto-fills in onboarding
                  </Badge>
                )}
              </div>

              <IconInput
                label="Allergies"
                icon={AlertTriangle}
                id="allergies"
                value={profile.health.allergies}
                onChange={(v) => updateHealth({ allergies: v })}
                placeholder="Peanuts, gluten, etc."
              />

              <div className="space-y-2 sm:col-span-2">
                <IconInput
                  label="Medical Conditions"
                  icon={Pill}
                  id="medical"
                  value={profile.health.medicalConditions}
                  onChange={(v) => updateHealth({ medicalConditions: v })}
                  placeholder="Diabetes, BP, etc."
                />
                <p className="text-xs text-muted-foreground">This helps us prepare for your safety during the detox.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Blood Group</label>
                <div className="relative">
                  <Droplets className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                  <Select value={profile.health.bloodGroup || "not-sure"} onValueChange={(v) => updateHealth({ bloodGroup: v === "not-sure" ? "" : v })}>
                    <SelectTrigger className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-sure">Not sure</SelectItem>
                      {bloodOptions.map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {profile.health.bloodGroup && (
                  <Badge variant="outline" className="border-brand/30 text-brand text-[10px] font-medium">
                    Auto-fills in onboarding
                  </Badge>
                )}
              </div>
            </div>

            <hr className="border-border/40" />
            <SaveButton label="Save Preferences" saved={saved} savedMessage="Preferences saved. Onboarding will auto-fill." />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

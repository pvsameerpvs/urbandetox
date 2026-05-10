"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Utensils, AlertTriangle, Pill } from "lucide-react";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import { IconInput } from "../components/IconInput";
import { SaveButton } from "../components/SaveButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PreferencesPage() {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6 sm:p-8">
          <ProfileSectionHeader
            icon={Heart}
            title="Preferences"
            description="Dietary needs, allergies, and medical info."
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Food preference */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Food Preference</label>
                <div className="relative">
                  <Utensils className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Select defaultValue="vegetarian">
                    <SelectTrigger className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="jain">Jain</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <IconInput label="Allergies" icon={AlertTriangle} id="allergies" defaultValue="None" placeholder="Peanuts, gluten, etc." />
              
              <div className="space-y-2 sm:col-span-2">
                <IconInput label="Medical Conditions" icon={Pill} id="medical" defaultValue="None" placeholder="Diabetes, BP, etc." />
                <p className="text-xs text-muted-foreground">This helps us prepare for your safety during the detox.</p>
              </div>
            </div>

            <hr className="border-border/40" />

            <SaveButton
              label="Save Preferences"
              saved={saved}
              savedMessage="Preferences saved successfully."
            />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

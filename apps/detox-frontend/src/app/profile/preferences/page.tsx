"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, Utensils, AlertTriangle, Pill, Save } from "lucide-react";

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
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
              <Heart className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Preferences</h2>
              <p className="text-sm text-muted-foreground">Dietary needs, allergies, and medical info.</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Food preference */}
              <div className="space-y-2">
                <Label htmlFor="food" className="text-sm font-semibold">Food Preference</Label>
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

              {/* Allergies */}
              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-sm font-semibold">Allergies</Label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="allergies"
                    placeholder="Peanuts, gluten, etc."
                    defaultValue="None"
                    className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
                  />
                </div>
              </div>

              {/* Medical conditions */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="medical" className="text-sm font-semibold">Medical Conditions</Label>
                <div className="relative">
                  <Pill className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="medical"
                    placeholder="Diabetes, BP, etc."
                    defaultValue="None"
                    className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">This helps us prepare for your safety during the detox.</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-brand/10"
              >
                <Save className="mr-2 h-4 w-4" /> Save Preferences
              </Button>
              {saved && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs font-normal">
                  Preferences saved successfully.
                </Badge>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

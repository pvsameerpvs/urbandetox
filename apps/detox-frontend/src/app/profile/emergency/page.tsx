"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PhoneCall, User, Heart, AlertCircle, Phone } from "lucide-react";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import { IconInput } from "../components/IconInput";
import { SaveButton } from "../components/SaveButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EmergencyContactPage() {
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
            icon={PhoneCall}
            title="Emergency Contact"
            description="Who we contact in case of an emergency."
          />

          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 mb-6">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              This person will be contacted if we cannot reach you during an emergency situation.
              Please ensure their details are accurate and up to date.
            </p>
          </div>

          <hr className="border-border/40 mb-6" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <IconInput label="Full Name" icon={User} id="eName" defaultValue="Jane Doe" />
              <IconInput label="Phone Number" icon={Phone} id="ePhone" defaultValue="+91 98765 43211" />
              <IconInput label="Email" icon={User} id="eEmail" defaultValue="jane@example.com" />
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Relationship</label>
                <div className="relative">
                  <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Select defaultValue="spouse">
                    <SelectTrigger className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse / Partner</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <hr className="border-border/40" />

            <SaveButton
              label="Save Emergency Contact"
              saved={saved}
              savedMessage="Emergency contact saved."
            />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

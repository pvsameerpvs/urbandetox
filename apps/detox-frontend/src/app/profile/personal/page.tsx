"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import { IconInput } from "../components/IconInput";
import { SaveButton } from "../components/SaveButton";
import { useUserProfile } from "@/lib/user-profile";
import { cn } from "@/lib/utils";
import { User, Phone, Mail, CalendarDays, Camera } from "lucide-react";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not", label: "Prefer not to say" },
];

export default function PersonalDetailsPage() {
  const { profile, updatePersonal } = useUserProfile();
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
          <ProfileSectionHeader icon={User} title="Personal Details" description="Update your personal information. This will auto-fill your booking forms." />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-brand/10">
                <AvatarFallback className="bg-brand text-brand-foreground text-lg font-bold">
                  {profile.personal.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm" className="rounded-full h-9 border-border/60 text-xs font-medium">
                <Camera className="mr-1.5 h-3.5 w-3.5" /> Change Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <IconInput
                label="Full Name"
                icon={User}
                id="fullName"
                value={profile.personal.fullName}
                onChange={(v) => updatePersonal({ fullName: v })}
              />
              <IconInput
                label="Phone Number"
                icon={Phone}
                id="phone"
                value={profile.personal.phone}
                onChange={(v) => updatePersonal({ phone: v })}
              />
              <IconInput
                label="Email"
                icon={Mail}
                id="email"
                type="email"
                value={profile.personal.email}
                onChange={(v) => updatePersonal({ email: v })}
              />
              <IconInput
                label="Date of Birth"
                icon={CalendarDays}
                id="dob"
                type="date"
                value={profile.personal.dateOfBirth}
                onChange={(v) => updatePersonal({ dateOfBirth: v })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Gender</label>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => updatePersonal({ gender: g.value })}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                      profile.personal.gender === g.value
                        ? "border-brand bg-brand/5 text-brand"
                        : "border-border/60 text-muted-foreground hover:border-brand/40 hover:bg-secondary/30"
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-border/40" />
            <SaveButton label="Save Changes" saved={saved} savedMessage="Changes saved. Booking forms will auto-fill." />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { User, Phone, Mail, CalendarDays, Save, Camera } from "lucide-react";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import { IconInput } from "../components/IconInput";
import { SaveButton } from "../components/SaveButton";

export default function PersonalDetailsPage() {
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
            icon={User}
            title="Personal Details"
            description="Update your personal information."
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-brand/10">
                <AvatarFallback className="bg-brand text-brand-foreground text-lg font-bold">JD</AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full h-9 border-border/60 text-xs font-medium"
              >
                <Camera className="mr-1.5 h-3.5 w-3.5" /> Change Photo
              </Button>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <IconInput label="Full Name" icon={User} id="fullName" defaultValue="John Doe" />
              <IconInput label="Phone Number" icon={Phone} id="phone" defaultValue="+91 98765 43210" />
              <IconInput label="Email" icon={Mail} id="email" type="email" defaultValue="john@example.com" />
              <IconInput label="Date of Birth" icon={CalendarDays} id="dob" type="date" defaultValue="1990-05-15" />
            </div>

            <hr className="border-border/40" />

            <SaveButton
              label="Save Changes"
              saved={saved}
              savedMessage="Changes saved successfully."
            />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

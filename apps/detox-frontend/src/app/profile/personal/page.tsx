"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { User, Mail, Phone, CalendarDays, Save, Camera } from "lucide-react";

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
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
              <User className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Personal Details</h2>
              <p className="text-sm text-muted-foreground">Update your personal information.</p>
            </div>
          </div>

          <Separator className="mb-6" />

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
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    defaultValue="John Doe"
                    className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    defaultValue="+91 98765 43210"
                    className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                    className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="text-sm font-semibold">Date of Birth</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dob"
                    type="date"
                    defaultValue="1990-05-15"
                    className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Submit */}
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-brand/10"
              >
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
              {saved && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs font-normal animate-fade-in">
                  Changes saved successfully.
                </Badge>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

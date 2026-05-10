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
import { PhoneCall, User, Heart, Save, AlertCircle, Phone } from "lucide-react";

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
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
              <PhoneCall className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Emergency Contact</h2>
              <p className="text-sm text-muted-foreground">Who we contact in case of an emergency.</p>
            </div>
          </div>

          {/* Info alert */}
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 mb-6">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              This person will be contacted if we cannot reach you during an emergency situation.
              Please ensure their details are accurate and up to date.
            </p>
          </div>

          <Separator className="mb-6" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Contact name */}
              <div className="space-y-2">
                <Label htmlFor="eName" className="text-sm font-semibold">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="eName"
                    defaultValue="Jane Doe"
                    className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="ePhone" className="text-sm font-semibold">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ePhone"
                    defaultValue="+91 98765 43211"
                    className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="eEmail" className="text-sm font-semibold">Email</Label>
                <Input
                  id="eEmail"
                  defaultValue="jane@example.com"
                  className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
                />
              </div>

              {/* Relationship */}
              <div className="space-y-2">
                <Label htmlFor="eRelation" className="text-sm font-semibold">Relationship</Label>
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

            <Separator />

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-brand/10"
              >
                <Save className="mr-2 h-4 w-4" /> Save Emergency Contact
              </Button>
              {saved && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs font-normal">
                  Emergency contact saved.
                </Badge>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

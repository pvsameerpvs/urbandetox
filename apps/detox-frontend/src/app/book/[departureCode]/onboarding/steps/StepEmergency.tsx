"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PrefilledBadge } from "../components/PrefilledBadge";
import { User, Phone, Heart, PhoneCall, Trash2 } from "lucide-react";

interface Contact {
  name: string;
  phone: string;
  relation: string;
}

interface StepEmergencyProps {
  contacts: Contact[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  profileCount: number;
}

export function StepEmergency({ contacts, onAdd, onRemove, profileCount }: StepEmergencyProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl bg-brand/5 border border-brand/10 p-3">
        <span className="text-lg shrink-0">✨</span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {profileCount > 0
            ? `We've pre-filled ${profileCount} emergency contact${profileCount > 1 ? "s" : ""} from your profile. You can add more or edit them for this specific trip.`
            : "Provide at least one emergency contact. We will reach them if we cannot contact you during an emergency."}
        </p>
      </div>

      {contacts.map((contact, index) => (
        <div key={index} className="space-y-4 rounded-2xl bg-secondary/20 p-4 sm:p-5 relative">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold">Emergency Contact {index + 1}</h4>
              {index < profileCount && (
                <PrefilledBadge />
              )}
            </div>
            {contacts.length > 1 && (
              <button onClick={() => onRemove(index)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input defaultValue={contact.name} placeholder="Contact name" className="h-12 pl-11 rounded-xl bg-white border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input defaultValue={contact.phone} type="tel" placeholder="+91 98765 43210" className="h-12 pl-11 rounded-xl bg-white border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-sm font-semibold">Relationship</Label>
              <div className="relative">
                <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Select defaultValue={contact.relation}>
                  <SelectTrigger className="h-12 pl-11 rounded-xl bg-white border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {["spouse", "parent", "sibling", "friend", "colleague", "other"].map((r) => (
                      <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={onAdd} className="w-full rounded-xl border-border/60 h-11 text-sm font-medium">
        <PhoneCall className="mr-2 h-4 w-4" /> Add Another Emergency Contact
      </Button>
    </div>
  );
}

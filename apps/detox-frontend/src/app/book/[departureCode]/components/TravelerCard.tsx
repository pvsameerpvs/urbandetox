"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Traveler } from "@/lib/booking-state";
import { User, Users, Phone, ChevronDown, ChevronUp, Check, AlertCircle } from "lucide-react";

interface TravelerCardProps {
  traveler: Traveler;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (data: Partial<Traveler>) => void;
}

export function TravelerCard({ traveler, index, isExpanded, onToggle, onUpdate }: TravelerCardProps) {
  const isPrimary = traveler.type === "primary";
  const isComplete = traveler.name.trim().length > 2 && traveler.phone.trim().length > 5;

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300 overflow-hidden",
        isExpanded ? "border-brand/30 shadow-md shadow-brand/5" : "border-border/40 shadow-sm",
        isComplete && !isExpanded && "border-emerald-200 bg-emerald-50/30",
        !isComplete && !isExpanded && "border-amber-200 bg-amber-50/20"
      )}
    >
      {/* Card Header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 sm:p-5 text-left"
      >
        <div className={cn(
          "inline-flex items-center justify-center rounded-xl h-10 w-10 shrink-0",
          isPrimary ? "bg-brand text-brand-foreground" : "bg-secondary text-muted-foreground"
        )}>
          {isPrimary ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold truncate">
              {traveler.name.trim() || `Traveler ${index + 1}`}
            </p>
            {isPrimary && <Badge className="bg-brand/10 text-brand border-0 text-[10px] font-medium">Primary</Badge>}
            {isComplete && !isExpanded && <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50 text-[10px]"><Check className="mr-1 h-2.5 w-2.5" /> Ready</Badge>}
            {!isComplete && !isExpanded && <Badge variant="outline" className="border-amber-200 text-amber-600 bg-amber-50 text-[10px]"><AlertCircle className="mr-1 h-2.5 w-2.5" /> Incomplete</Badge>}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {traveler.phone ? traveler.phone : isPrimary ? "Pre-filled from profile" : "Tap to fill details"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-4 border-t border-border/20 pt-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={traveler.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="Full name"
                className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={traveler.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                type="tel"
                placeholder="+91 98765 43210"
                className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
              />
            </div>
          </div>

          {/* Food Preference */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Food Preference</Label>
            <Select value={traveler.foodPreference} onValueChange={(v) => onUpdate({ foodPreference: v ?? "vegetarian" })}>
              <SelectTrigger className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["vegetarian", "vegan", "non-vegetarian", "jain", "no-preference"].map((v) => (
                  <SelectItem key={v} value={v}>{v.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Allergies */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Allergies (if any)</Label>
            <Input
              value={traveler.allergies}
              onChange={(e) => onUpdate({ allergies: e.target.value })}
              placeholder="None / Nuts / Gluten"
              className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
            />
          </div>

          {/* Done button on mobile */}
          <Button type="button" onClick={onToggle} className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 text-sm font-semibold sm:hidden">
            Done
          </Button>
        </div>
      )}
    </div>
  );
}

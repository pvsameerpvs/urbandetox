"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Minus, Plus, ChevronRight } from "lucide-react";

interface TravelerFormProps {
  travelers: number;
  maxSeats: number;
  onTravelersChange: (count: number) => void;
  onSubmit: () => void;
}

export function TravelerForm({ travelers, maxSeats, onTravelersChange, onSubmit }: TravelerFormProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="name" placeholder="Your full name" required className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="phone" type="tel" placeholder="+91 98765 43210" required className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="email" type="email" placeholder="you@example.com" className="h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Number of Travelers</Label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onTravelersChange(Math.max(1, travelers - 1))} className="inline-flex items-center justify-center h-12 w-12 rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary transition-colors shrink-0">
            <Minus className="h-4 w-4" />
          </button>
          <Input type="number" min={1} max={maxSeats} value={travelers} onChange={(e) => onTravelersChange(Number(e.target.value))} className="h-12 text-center w-20 sm:w-24 rounded-xl bg-secondary/40 border-0 text-sm font-bold focus-visible:ring-2 focus-visible:ring-brand/20" />
          <button type="button" onClick={() => onTravelersChange(Math.min(maxSeats, travelers + 1))} className="inline-flex items-center justify-center h-12 w-12 rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary transition-colors shrink-0">
            <Plus className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground ml-1">Max {maxSeats} seats</span>
        </div>
      </div>

      <Button type="submit" className="w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 text-sm font-semibold shadow-lg shadow-brand/10">
        Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}

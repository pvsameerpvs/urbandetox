"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Camera, Upload } from "lucide-react";
import type { CommonDetails } from "@/lib/booking-state";

interface StepFinalConfirmProps {
  common: CommonDetails;
  onUpdate: (d: Partial<CommonDetails>) => void;
  travelerCount?: number;
}

export function StepFinalConfirm({ common, onUpdate, travelerCount = 1 }: StepFinalConfirmProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Mode of Arrival</Label>
        <Select value={common.modeOfArrival} onValueChange={(v) => onUpdate({ modeOfArrival: v ?? "" })}>
          <SelectTrigger className="h-12 rounded-xl bg-secondary/40 border-0 text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="How will you reach the meeting point?" />
          </SelectTrigger>
          <SelectContent>
            {["bus", "train", "flight", "self-drive", "cab", "shared"].map((m) => (
              <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1).replace("-", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Upload {travelerCount > 1 ? "Group" : "Your"} Photo (Optional)</Label>
        <div className="rounded-xl border-2 border-dashed border-border/60 bg-secondary/20 p-5 sm:p-6 text-center hover:border-brand/40 hover:bg-brand/5 transition-colors cursor-pointer">
          <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">Upload {travelerCount > 1 ? "a group photo" : "your photo"}</p>
          <p className="text-xs text-muted-foreground mb-2">Helps our guide recognize {travelerCount > 1 ? "your group" : "you"} at pickup</p>
          <Button type="button" variant="outline" size="sm" className="rounded-full h-9"><Upload className="mr-1.5 h-3.5 w-3.5" /> Choose File</Button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-brand/5 border border-brand/10 p-4 sm:p-5">
        <Checkbox id="confirmAll" className="mt-0.5 shrink-0" />
        <Label htmlFor="confirmAll" className="text-sm font-normal leading-relaxed">
          <span className="font-semibold">{travelerCount > 1 ? "I confirm all details are accurate for everyone in my group." : "I confirm all details are accurate."}</span>
          <span className="text-muted-foreground block text-xs mt-0.5">I have read and accept the trip terms, cancellation policy, and safety guidelines.</span>
        </Label>
      </div>
    </div>
  );
}

"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Camera, Upload } from "lucide-react";

export function StepConfirm() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Mode of Arrival at Meeting Point</Label>
        <Select defaultValue="">
          <SelectTrigger className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20">
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
        <Label className="text-sm font-semibold">Upload a Recent Photo</Label>
        <div className="rounded-xl border-2 border-dashed border-border/60 bg-secondary/20 p-5 sm:p-6 text-center hover:border-brand/40 hover:bg-brand/5 transition-colors cursor-pointer">
          <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium mb-1">Upload your recent photo</p>
          <p className="text-xs text-muted-foreground mb-2">Passport-size, clear face visible (max 2MB)</p>
          <Button type="button" variant="outline" size="sm" className="rounded-full h-9"><Upload className="mr-1.5 h-3.5 w-3.5" /> Choose File</Button>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-secondary/20 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Checkbox id="travelHelp" className="mt-0.5 shrink-0" />
          <Label htmlFor="travelHelp" className="text-sm font-normal leading-relaxed">
            <span className="font-semibold">Do you require assistance with travel arrangements?</span>
            <span className="text-muted-foreground block text-xs mt-0.5">We can help coordinate transport to the meeting point if needed.</span>
          </Label>
        </div>
        <Separator className="bg-border/40" />
        <div className="flex items-start gap-3">
          <Checkbox id="paymentDone" defaultChecked className="mt-0.5 shrink-0" />
          <Label htmlFor="paymentDone" className="text-sm font-normal leading-relaxed">
            <span className="font-semibold">Have you completed the trip payment?</span>
            <span className="text-muted-foreground block text-xs mt-0.5">Confirm that the full payment has been made for this detox.</span>
          </Label>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-brand/5 border border-brand/10 p-4 sm:p-5">
        <Checkbox id="confirm" className="mt-0.5 shrink-0" />
        <Label htmlFor="confirm" className="text-sm font-normal leading-relaxed">
          <span className="font-semibold">I confirm all details are accurate.</span>
          <span className="text-muted-foreground block text-xs mt-0.5">I have read and accept the trip terms, cancellation policy, and safety guidelines.</span>
        </Label>
      </div>
    </div>
  );
}

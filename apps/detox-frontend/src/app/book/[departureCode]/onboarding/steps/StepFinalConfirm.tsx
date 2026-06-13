"use client";

import { useFormContext } from "react-hook-form";
import { MapPin, Camera, Upload } from "lucide-react";
import type { CommonDetails } from "@urbandetox/utils";
import { Label, Button, Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui";
import type { OnboardingFormValues } from "@/lib/onboarding-schema";

interface StepFinalConfirmProps {
  common: CommonDetails;
  onUpdate: (d: Partial<CommonDetails>) => void;
  travelerCount?: number;
}

export function StepFinalConfirm({ common, onUpdate, travelerCount = 1 }: StepFinalConfirmProps) {
  const { formState, setValue, watch } = useFormContext<OnboardingFormValues>();
  const confirmed = watch("confirmed");
  const modeError = formState.errors.modeOfArrival?.message;
  const confirmError = formState.errors.confirmed?.message;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Mode of Arrival</Label>
        <Select
          value={common.modeOfArrival}
          onValueChange={(v) => {
            onUpdate({ modeOfArrival: v ?? "" });
            setValue("modeOfArrival", v ?? "", { shouldValidate: true });
          }}
        >
          <SelectTrigger className={`h-12 rounded-xl bg-secondary/40 border-0 text-sm ${modeError ? "ring-2 ring-red-400" : ""}`}>
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="How will you reach the meeting point?" />
          </SelectTrigger>
          <SelectContent>
            {["bus", "train", "flight", "self-drive", "cab", "shared"].map((m) => (
              <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1).replace("-", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {modeError && <p className="text-red-500 text-xs mt-1">{modeError}</p>}
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
        <Checkbox
          id="confirmAll"
          className="mt-0.5 shrink-0"
          checked={confirmed === true}
          onCheckedChange={(checked) => {
            setValue("confirmed", checked === true ? true as const : false as unknown as true, { shouldValidate: true });
          }}
        />
        <div className="space-y-1">
          <Label htmlFor="confirmAll" className="text-sm font-normal leading-relaxed cursor-pointer">
            <span className="font-semibold">{travelerCount > 1 ? "I confirm all details are accurate for everyone in my group." : "I confirm all details are accurate."}</span>
            <span className="text-muted-foreground block text-xs mt-0.5">I have read and accept the trip terms, cancellation policy, and safety guidelines.</span>
          </Label>
          {confirmError && <p className="text-red-500 text-xs mt-1">{confirmError}</p>}
        </div>
      </div>
    </div>
  );
}

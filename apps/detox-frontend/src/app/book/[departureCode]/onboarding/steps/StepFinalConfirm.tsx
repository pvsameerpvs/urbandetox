"use client";

import { useFormContext } from "react-hook-form";
import { MapPin } from "lucide-react";
import type { CommonDetails, Traveler } from "@urbandetox/utils";
import { TravellerDocuments } from "../components/TravellerDocuments";
import { Label, Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui";
import type { OnboardingFormValues } from "@/lib/onboarding-schema";

interface StepFinalConfirmProps {
  common: CommonDetails;
  onUpdate: (d: Partial<CommonDetails>) => void;
  travelerCount?: number;
  travelers?: Traveler[];
  bookingId?: string;
  onUpdateTraveler?: (index: number, patch: Partial<Traveler>) => void;
}

export function StepFinalConfirm({ common, onUpdate, travelerCount = 1, travelers = [], bookingId, onUpdateTraveler }: StepFinalConfirmProps) {
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

      {onUpdateTraveler && travelers.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            Photo and ID {travelerCount > 1 ? "for each traveller" : ""}
          </Label>
          <p className="text-xs text-muted-foreground">
            Your guide uses the photo to find you at pickup. The ID is held
            privately and is never shown publicly.
          </p>
          <TravellerDocuments
            travelers={travelers}
            bookingId={bookingId}
            onUpdate={onUpdateTraveler}
          />
        </div>
      )}

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
            <span className="text-muted-foreground block text-xs mt-0.5">
              I have read and accept the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">trip terms</a>,{" "}
              <a href="/terms#cancellation-and-refund-policy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">cancellation policy</a>, and safety guidelines.
            </span>
          </Label>
          {confirmError && <p className="text-red-500 text-xs mt-1">{confirmError}</p>}
        </div>
      </div>
    </div>
  );
}

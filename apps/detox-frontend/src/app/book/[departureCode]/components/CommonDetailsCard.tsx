"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { CommonDetails } from "@/lib/booking-state";
import { MessageSquare, HelpCircle } from "lucide-react";

interface CommonDetailsProps {
  common: CommonDetails;
  onUpdate: (data: Partial<CommonDetails>) => void;
  travelerCount?: number;
}

export function CommonDetailsCard({ common, onUpdate, travelerCount = 1 }: CommonDetailsProps) {
  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
      <CardContent className="p-4 sm:p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2 shrink-0">
            <HelpCircle className="h-4 w-4 text-brand" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Trip Preferences</h3>
            <p className="text-xs text-muted-foreground">
              {travelerCount > 1 ? "Shared notes for your group" : "Special requests for your trip"}
            </p>
          </div>
        </div>

        {/* Note / Group Note */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">{travelerCount > 1 ? "Group Note" : "Note"} (Optional)</Label>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <textarea
              value={common.groupNote}
              onChange={(e) => onUpdate({ groupNote: e.target.value })}
              placeholder={travelerCount > 1 ? "Celebrating birthday, need wheelchair access, rooming preferences, etc." : "Special requests, accessibility needs, dietary notes, etc."}
              className="w-full min-h-[80px] rounded-xl bg-secondary/40 border-0 p-3 pl-11 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand/20 resize-none"
            />
          </div>
        </div>

        {/* Travel Help Checkbox */}
        <div className="flex items-start gap-3 rounded-xl bg-secondary/20 p-3 sm:p-4">
          <Checkbox
            id="travelHelp"
            checked={common.needsTravelHelp}
            onCheckedChange={(v) => onUpdate({ needsTravelHelp: v === true })}
            className="mt-0.5 shrink-0"
          />
          <Label htmlFor="travelHelp" className="text-sm font-normal leading-relaxed">
            <span className="font-semibold">Need help with travel arrangements?</span>
            <span className="text-muted-foreground block text-xs mt-0.5">We can coordinate transport to the meeting point.</span>
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

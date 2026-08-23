"use client";

import { Input, Label, Textarea } from "@urbandetox/ui";
import type { CommonDetails } from "@urbandetox/utils";

interface SharedGroupCardProps {
  common: CommonDetails;
  onChange: (patch: Partial<CommonDetails>) => void;
}

export function SharedGroupCard({ common, onChange }: SharedGroupCardProps) {
  return (
    <div className="rounded-2xl border-0 bg-white p-5 shadow-lg shadow-black/[0.03] sm:p-6">
      <h3 className="mb-5 text-sm font-bold">A few things about the group</h3>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="modeOfArrival" className="text-xs font-semibold">
            How are you reaching the pickup point?
          </Label>
          <Input
            id="modeOfArrival"
            value={common.modeOfArrival}
            onChange={(e) => onChange({ modeOfArrival: e.target.value })}
            placeholder="e.g. Train to Bangalore, then cab"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="groupNote" className="text-xs font-semibold">
            Anything else we should know?
          </Label>
          <Textarea
            id="groupNote"
            rows={3}
            value={common.groupNote}
            onChange={(e) => onChange({ groupNote: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={common.needsTravelHelp}
            onChange={(e) => onChange({ needsTravelHelp: e.target.checked })}
            className="h-4 w-4 rounded border-border accent-[var(--brand)]"
          />
          I would like help arranging travel to the pickup point
        </label>
      </div>
    </div>
  );
}

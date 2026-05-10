"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Users, Upload, Camera } from "lucide-react";

export function StepTravelParty({ party, setParty }: { party: string; setParty: (v: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Are you traveling solo or with others?</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "solo", icon: User, label: "Solo" },
            { value: "group", icon: Users, label: "With Others" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setParty(opt.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 sm:p-5 text-center transition-all duration-300",
                party === opt.value ? "border-brand bg-brand/5 shadow-sm" : "border-border/60 hover:border-brand/40 hover:bg-secondary/30"
              )}
            >
              <opt.icon className={cn("h-6 w-6", party === opt.value ? "text-brand" : "text-muted-foreground")} />
              <span className={cn("text-sm font-bold", party === opt.value ? "text-brand" : "text-foreground")}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {party === "group" && (
        <div className="space-y-2">
          <Label htmlFor="companions" className="text-sm font-semibold">Companion Names</Label>
          <textarea
            id="companions"
            placeholder="Enter full names of all companions (comma separated)"
            className="w-full min-h-[80px] rounded-xl bg-secondary/40 border-0 p-3 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand/20 resize-none"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Upload a Recent Photo</Label>
        <div className="rounded-xl border-2 border-dashed border-border/60 bg-secondary/20 p-6 sm:p-8 text-center hover:border-brand/40 hover:bg-brand/5 transition-colors cursor-pointer">
          <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium mb-1">Drop your photo here</p>
          <p className="text-xs text-muted-foreground mb-3">Passport-size, white background (JPG, PNG, max 2MB)</p>
          <Button type="button" variant="outline" size="sm" className="rounded-full h-9"><Upload className="mr-1.5 h-3.5 w-3.5" /> Choose File</Button>
        </div>
      </div>
    </div>
  );
}

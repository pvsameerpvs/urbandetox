"use client";

;
import { Sparkles } from "lucide-react";
import { Badge } from "@urbandetox/ui"

export function PrefilledBadge() {
  return (
    <Badge variant="outline" className="border-brand/30 text-brand text-[10px] font-medium bg-brand/5">
      <Sparkles className="mr-1 h-2.5 w-2.5" /> From your profile
    </Badge>
  );
}

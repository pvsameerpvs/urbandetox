"use client";

import { Badge } from "@urbandetox/ui";

interface StatusBadgeProps {
  status: string;
  seatsLeft: number;
}

export function StatusBadge({ status, seatsLeft }: StatusBadgeProps) {
  if (status === "full") {
    return (
      <Badge
        variant="secondary"
        className="bg-muted/80 text-muted-foreground backdrop-blur-sm text-xs border-0"
      >
        Full
      </Badge>
    );
  }

  if (status === "filling") {
    return (
      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">
        {seatsLeft} left
      </Badge>
    );
  }

  return (
    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">
      {seatsLeft} left
    </Badge>
  );
}

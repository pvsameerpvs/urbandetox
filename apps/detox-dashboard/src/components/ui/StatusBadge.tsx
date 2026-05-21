"use client";

import { CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "open") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
        <CheckCircle2 className="h-3 w-3" /> Open
      </span>
    );
  }
  if (status === "filling") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
        <AlertCircle className="h-3 w-3" /> Filling
      </span>
    );
  }
  if (status === "full") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500">
        <XCircle className="h-3 w-3" /> Full
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
      <Clock className="h-3 w-3" /> Closed
    </span>
  );
}

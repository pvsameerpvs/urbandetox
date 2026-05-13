"use client";

;
;
import { Save } from "lucide-react";
import { Button, Badge } from "@urbandetox/ui"

interface SaveButtonProps {
  label: string;
  saved: boolean;
  savedMessage: string;
}

export function SaveButton({ label, saved, savedMessage }: SaveButtonProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        type="submit"
        className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-brand/10"
      >
        <Save className="mr-2 h-4 w-4" /> {label}
      </Button>
      {saved && (
        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs font-normal">
          {savedMessage}
        </Badge>
      )}
    </div>
  );
}

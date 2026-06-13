"use client";

import { Save, Loader2 } from "lucide-react";
import { Button, Badge } from "@urbandetox/ui"

interface SaveButtonProps {
  label: string;
  saved: boolean;
  savedMessage: string;
  disabled?: boolean;
  isSaving?: boolean;
  errors?: Record<string, string>;
}

export function SaveButton({ label, saved, savedMessage, disabled, isSaving, errors }: SaveButtonProps) {
  const hasErrors = errors && Object.keys(errors).length > 0;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        type="submit"
        disabled={disabled || isSaving}
        className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-brand/10"
      >
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {isSaving ? "Saving..." : label}
      </Button>
      {saved && !hasErrors && (
        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs font-normal">
          {savedMessage}
        </Badge>
      )}
      {hasErrors && (
        <Badge className="bg-red-100 text-red-700 border-0 text-xs font-normal">
          {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? "s" : ""} need attention
        </Badge>
      )}
    </div>
  );
}

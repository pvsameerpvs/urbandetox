"use client";

import { Input, Label } from "@urbandetox/ui";

interface RequestFieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}

export function RequestField({
  id,
  label,
  type = "text",
  required,
  placeholder,
  hint,
}: RequestFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        min={type === "number" ? 1 : undefined}
        className="h-11 rounded-xl border-0 bg-secondary/40 text-sm focus-visible:ring-2 focus-visible:ring-brand/40"
      />
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

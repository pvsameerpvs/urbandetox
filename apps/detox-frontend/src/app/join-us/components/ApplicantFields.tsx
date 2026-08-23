"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input, Label } from "@urbandetox/ui";
import type { GuideApplicationValues } from "@/lib/guide-application-schema";

const FIELDS = [
  { name: "fullName", label: "Full name", type: "text", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", placeholder: "+91" },
  { name: "city", label: "City you are based in", type: "text", placeholder: "e.g. Kozhikode" },
] as const;

export function ApplicantFields({ form }: { form: UseFormReturn<GuideApplicationValues> }) {
  const err = form.formState.errors;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {FIELDS.map((f) => (
        <div key={f.name} className="space-y-1.5">
          <Label htmlFor={f.name} className="text-sm font-medium">{f.label}</Label>
          <Input
            id={f.name}
            type={f.type}
            placeholder={f.placeholder}
            className="h-12 rounded-xl"
            {...form.register(f.name)}
          />
          {err[f.name] && <p className="text-xs text-red-500">{err[f.name]?.message}</p>}
        </div>
      ))}
    </div>
  );
}

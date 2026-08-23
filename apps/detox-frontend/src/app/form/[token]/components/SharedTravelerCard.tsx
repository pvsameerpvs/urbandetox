"use client";

import { Input, Label } from "@urbandetox/ui";
import type { Traveler } from "@urbandetox/utils";
import { DocumentUpload } from "@/components/documents/DocumentUpload";

const FOOD = ["vegetarian", "non-vegetarian", "vegan", "jain"];
const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];

interface SharedTravelerCardProps {
  traveler: Traveler;
  index: number;
  bookingId: string;
  token: string;
  onChange: (patch: Partial<Traveler>) => void;
}

export function SharedTravelerCard({ traveler, index, bookingId, token, onChange }: SharedTravelerCardProps) {
  const set = (key: keyof Traveler) => (e: { target: { value: string } }) =>
    onChange({ [key]: e.target.value } as Partial<Traveler>);

  const field = (
    key: keyof Traveler,
    label: string,
    opts: { type?: string; placeholder?: string } = {}
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={`${key}-${index}`} className="text-xs font-semibold">{label}</Label>
      <Input
        id={`${key}-${index}`}
        type={opts.type ?? "text"}
        placeholder={opts.placeholder}
        value={(traveler[key] as string) ?? ""}
        onChange={set(key)}
        className="h-11 rounded-xl"
      />
    </div>
  );

  const select = (key: keyof Traveler, label: string, options: string[]) => (
    <div className="space-y-1.5">
      <Label htmlFor={`${key}-${index}`} className="text-xs font-semibold">{label}</Label>
      <select
        id={`${key}-${index}`}
        value={(traveler[key] as string) ?? ""}
        onChange={set(key)}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand/50"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="rounded-2xl border-0 bg-white p-5 shadow-lg shadow-black/[0.03] sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10 text-xs font-bold text-brand">
          {index + 1}
        </span>
        <h3 className="text-sm font-bold">
          {traveler.type === "primary" ? "Lead traveller" : `Traveller ${index + 1}`}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("name", "Full name")}
        {field("phone", "Phone", { type: "tel" })}
        {field("email", "Email", { type: "email" })}
        {field("dateOfBirth", "Date of birth", { type: "date" })}
        {select("gender", "Gender", GENDERS)}
        {select("foodPreference", "Food preference", FOOD)}
        {field("bloodGroup", "Blood group", { placeholder: "e.g. O+" })}
        {field("allergies", "Allergies", { placeholder: "None" })}
      </div>

      <div className="mt-4">
        {field("medicalConditions", "Medical conditions we should know about", {
          placeholder: "None",
        })}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border/50 pt-5 sm:grid-cols-2">
        <DocumentUpload
          label="Passport-size photo"
          kind="photo"
          bookingId={bookingId}
          token={token}
          value={traveler.photoUrl || undefined}
          onUploaded={(path) => onChange({ photoUrl: path })}
        />
        <DocumentUpload
          label="Government ID (Aadhaar, passport or DL)"
          hint="Held privately, never shown publicly"
          kind="id"
          bookingId={bookingId}
          token={token}
          value={traveler.idUrl || undefined}
          onUploaded={(path) => onChange({ idUrl: path, idType: traveler.idType || "ID" })}
        />
      </div>

      <div className="mt-5 border-t border-border/50 pt-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Emergency contact
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {field("emergencyName", "Name")}
          {field("emergencyPhone", "Phone", { type: "tel" })}
          {field("emergencyRelation", "Relationship")}
        </div>
      </div>
    </div>
  );
}

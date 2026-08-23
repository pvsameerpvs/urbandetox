"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button, Label, Textarea } from "@urbandetox/ui";
import type { Destination } from "@urbandetox/utils";
import { submitGuideRequest } from "@/lib/api";
import { RequestField } from "./RequestField";
import { LanguagePicker } from "./LanguagePicker";

interface GuideRequestFormProps {
  destinations: Destination[];
}

export function GuideRequestForm({ destinations }: GuideRequestFormProps) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);

  const toggleLanguage = (l: string) =>
    setLanguages((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const groupRaw = String(fd.get("groupSize") ?? "").trim();
    setError(null);
    setBusy(true);
    try {
      await submitGuideRequest({
        fullName: String(fd.get("fullName") ?? "").trim(),
        email: String(fd.get("email") ?? "").trim(),
        phone: String(fd.get("phone") ?? "").trim(),
        location: String(fd.get("location") ?? "").trim(),
        travelDates: String(fd.get("travelDates") ?? "").trim() || undefined,
        // Left out entirely when blank, rather than sent as 0.
        groupSize: groupRaw ? Number(groupRaw) : undefined,
        needs: String(fd.get("needs") ?? "").trim() || undefined,
        languages: languages.length ? languages : undefined,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your request.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <section className="pb-20">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-7 w-7 text-emerald-700" />
          </div>
          <h2 className="mb-2 text-xl font-bold">Request sent</h2>
          <p className="text-sm text-muted-foreground">
            We will come back to you on WhatsApp or email, usually within a day.
            If we cannot find a good guide for that place we will say so.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h2 className="mb-1.5 text-xl font-bold">Tell us what you need</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Only the first four are required. The rest just helps us match better.
        </p>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <RequestField id="fullName" label="Your name" required />
          <RequestField id="email" label="Email" type="email" required />
          <RequestField id="phone" label="Phone or WhatsApp" type="tel" required />
          <RequestField
            id="location"
            label="Where are you going?"
            required
            placeholder="A town, a region, or a country"
            hint={
              destinations.length
                ? `Anywhere. We already work in ${destinations.length} places, but it does not have to be one of them.`
                : "Anywhere, not only places we run trips to."
            }
          />
          <RequestField id="travelDates" label="Roughly when?" placeholder="Second week of March" />
          <RequestField id="groupSize" label="How many of you?" type="number" placeholder="2" />

          <LanguagePicker selected={languages} onToggle={toggleLanguage} />

          <div className="space-y-1.5">
            <Label htmlFor="needs" className="text-xs font-semibold">
              What do you want the guide for?
            </Label>
            <Textarea
              id="needs"
              name="needs"
              rows={4}
              placeholder="Walking the old town, birdwatching, getting around without a car, anything."
              className="rounded-xl bg-secondary/40 text-sm"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={busy}
            className="h-12 w-full rounded-xl bg-brand text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
          >
            {busy ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Send request</>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}

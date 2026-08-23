"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@urbandetox/ui";
import type { CommonDetails, Traveler } from "@urbandetox/utils";
import { fetchSharedForm, submitSharedForm } from "@/lib/api";
import { SharedFormHeader } from "./SharedFormHeader";
import { SharedTravelerCard } from "./SharedTravelerCard";
import { SharedGroupCard } from "./SharedGroupCard";
import { SharedFormStatus } from "./SharedFormStatus";

type Loaded = Awaited<ReturnType<typeof fetchSharedForm>>;

export function SharedFormClient({ token }: { token: string }) {
  const [data, setData] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [common, setCommon] = useState<CommonDetails>({
    groupNote: "", modeOfArrival: "", needsTravelHelp: false,
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    let active = true;
    fetchSharedForm(token)
      .then((d) => {
        if (!active) return;
        setData(d);
        setTravelers(d.travelers ?? []);
        if (d.common) setCommon(d.common);
        if (d.onboardingComplete) setDone(true);
      })
      .catch((e) => active && setLoadError(e instanceof Error ? e.message : "This link is not valid"));
    return () => { active = false; };
  }, [token]);

  const patch = useCallback((i: number, p: Partial<Traveler>) => {
    setTravelers((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...p } : t)));
  }, []);

  const submit = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaveError(null);
    try {
      await submitSharedForm(token, { travelers, common });
      setDone(true);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Could not save your details");
      savingRef.current = false;
    }
  };

  if (loadError) {
    return (
      <SharedFormStatus
        state="error"
        title={loadError}
        body="Ask us for a fresh link on WhatsApp and we will send one over."
      />
    );
  }

  if (!data) return <SharedFormStatus state="loading" />;

  if (done) {
    return (
      <SharedFormStatus
        state="done"
        title="Details received"
        body={`Thank you. We have everything we need for ${data.departureCode}. Our team will be in touch before departure.`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedFormHeader
        departureCode={data.departureCode}
        startDate={data.departure?.startDate}
        endDate={data.departure?.endDate}
        travelerCount={travelers.length || data.travelerCount}
      />

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-10 sm:px-6">
        {travelers.map((t, i) => (
          <SharedTravelerCard key={t.id ?? i} traveler={t} index={i} onChange={(p) => patch(i, p)} />
        ))}

        <SharedGroupCard common={common} onChange={(p) => setCommon((c) => ({ ...c, ...p }))} />

        {saveError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{saveError}</p>}

        <Button onClick={submit} className="h-12 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 font-semibold">
          <Send className="mr-2 h-4 w-4" /> Submit Details
        </Button>
      </div>
    </div>
  );
}

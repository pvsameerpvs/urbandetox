"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button, Input, Label, Textarea } from "@urbandetox/ui";
import type { Destination } from "@urbandetox/utils";
import { submitGuideApplication } from "@/lib/api";
import {
  GUIDE_LANGUAGES,
  guideApplicationSchema,
  type GuideApplicationValues,
} from "@/lib/guide-application-schema";
import { PillCheckboxGroup } from "./PillCheckboxGroup";
import { ApplicantFields } from "./ApplicantFields";

interface GuideApplicationFormProps {
  destinations: Destination[];
}

export function GuideApplicationForm({ destinations }: GuideApplicationFormProps) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sendingRef = useRef(false);

  const form = useForm<GuideApplicationValues>({
    resolver: standardSchemaResolver(guideApplicationSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", city: "",
      destinations: [], languages: [], experienceYears: 0,
      experience: "", about: "", instagram: "",
    },
  });

  const onSubmit = async (data: GuideApplicationValues) => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setError(null);
    try {
      await submitGuideApplication(data);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      sendingRef.current = false;
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="mb-3 text-2xl font-bold">Application received</h3>
        <p className="max-w-sm text-muted-foreground">
          Thanks for applying. If your experience fits an upcoming trip, we will
          reach out on WhatsApp.
        </p>
      </div>
    );
  }

  const err = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <ApplicantFields form={form} />

      <PillCheckboxGroup
        label="Which destinations can you guide?"
        options={destinations.map((d) => ({ value: d.slug, label: d.name }))}
        selected={form.watch("destinations")}
        onToggle={(v) => {
          const cur = form.getValues("destinations");
          form.setValue("destinations", cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v], { shouldValidate: true });
        }}
        error={err.destinations?.message}
      />

      <PillCheckboxGroup
        label="Languages you speak"
        options={GUIDE_LANGUAGES.map((l) => ({ value: l, label: l }))}
        selected={form.watch("languages")}
        onToggle={(v) => {
          const cur = form.getValues("languages");
          form.setValue("languages", cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v], { shouldValidate: true });
        }}
        error={err.languages?.message}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="experienceYears" className="text-sm font-medium">Years of guiding experience</Label>
          <Input id="experienceYears" type="number" min={0} max={60} className="h-12 rounded-xl" {...form.register("experienceYears", { valueAsNumber: true })} />
          {err.experienceYears && <p className="text-xs text-red-500">{err.experienceYears.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="instagram" className="text-sm font-medium">Instagram (optional)</Label>
          <Input id="instagram" placeholder="@yourhandle" className="h-12 rounded-xl" {...form.register("instagram")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="about" className="text-sm font-medium">Tell us about yourself</Label>
        <Textarea id="about" rows={5} placeholder="Where have you guided, what kind of groups, and why this suits you." className="rounded-xl" {...form.register("about")} />
        {err.about && <p className="text-xs text-red-500">{err.about.message}</p>}
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={form.formState.isSubmitting} className="h-12 w-full rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 font-semibold sm:w-auto sm:px-8">
        {form.formState.isSubmitting
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
          : <><Send className="mr-2 h-4 w-4" /> Send Application</>}
      </Button>
    </form>
  );
}

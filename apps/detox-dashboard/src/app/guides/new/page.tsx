"use client";

import { createGuide } from "@/lib/guides";
import { GuideForm } from "../components/GuideForm";

export default function NewGuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Guide</h1>
        <p className="text-sm text-muted-foreground mt-1">Create a travel guide, tip, or destination insight.</p>
      </div>
      <GuideForm onSave={(guide) => createGuide(guide)} />
    </div>
  );
}

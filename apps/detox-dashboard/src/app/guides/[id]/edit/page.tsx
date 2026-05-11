"use client";

import { useParams, notFound } from "next/navigation";
import { getAdminGuideById, updateGuide } from "@/lib/guides";
import { GuideForm } from "../../components/GuideForm";

export default function EditGuidePage() {
  const params = useParams();
  const id = String(params.id);
  const guide = getAdminGuideById(id);

  if (!guide) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Guide</h1>
        <p className="text-sm text-muted-foreground mt-1">Update content, links, and visibility.</p>
      </div>
      <GuideForm
        initial={guide}
        onSave={(g) => updateGuide(id, g)}
      />
    </div>
  );
}

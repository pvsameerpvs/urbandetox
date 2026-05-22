"use client";

import { useParams, notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { getAdminGuideById, updateGuide } from "@/lib/guides";
import { GuideForm } from "../../components/GuideForm";
import type { GuideArticle } from "@urbandetox/utils";

export default function EditGuidePage() {
  const params = useParams();
  const id = String(params.id);
  const [guide, setGuide] = useState<GuideArticle | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminGuideById(id).then((g) => {
      setGuide(g);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="py-20 text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!guide) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Guide</h1>
        <p className="text-sm text-muted-foreground mt-1">Update content, links, and visibility.</p>
      </div>
      <GuideForm
        initial={guide}
        onSave={async (g) => {
          await updateGuide(id, g);
        }}
      />
    </div>
  );
}

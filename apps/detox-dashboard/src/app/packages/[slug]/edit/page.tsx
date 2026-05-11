"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@urbandetox/ui";
import { Button } from "@urbandetox/ui";
import { updatePackage } from "@/lib/admin-data";
import { useAdminPackage, useAdminDestinations } from "@/hooks/use-admin-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BasicInfoFields } from "../../components/basic-info-fields";
import { HighlightsFields } from "../../components/highlights-fields";

export default function EditPackagePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const pkg = useAdminPackage(slug);
  const destinations = useAdminDestinations();

  const [form, setForm] = useState({
    title: pkg?.title || "",
    subtitle: pkg?.subtitle || "",
    destinationSlug: pkg?.destinationSlug || "",
    duration: pkg?.duration || 2,
    startingPrice: pkg?.startingPrice || 0,
    groupSize: pkg?.groupSize || "6 to 12",
    style: pkg?.style || "",
    seasonalTag: pkg?.seasonalTag || "Summer Escape",
    coverImage: pkg?.coverImage || "",
    highlights: (pkg?.highlights || [""]) as string[],
  });

  if (!pkg) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Package not found</h2>
        <Link href="/packages" className="text-brand hover:underline">Back to Packages</Link>
      </div>
    );
  }

  const setField = (field: "title" | "subtitle" | "destinationSlug" | "duration" | "startingPrice" | "groupSize" | "style" | "seasonalTag" | "coverImage", value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateHighlight = (index: number, value: string) => {
    setForm((prev) => {
      const h = [...prev.highlights];
      h[index] = value;
      return { ...prev, highlights: h };
    });
  };

  const addHighlight = () => setForm((prev) => ({ ...prev, highlights: [...prev.highlights, ""] }));
  const removeHighlight = (index: number) => setForm((prev) => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationLabel = `${form.duration} Days / ${form.duration - 1} Nights`;
    updatePackage(slug, { ...form, durationLabel, highlights: form.highlights.filter(Boolean) });
    router.push("/packages");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/packages" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Packages
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Package</h1>
      <p className="text-sm text-muted-foreground mb-6">Update {pkg.title} details.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Basic Info</h3>
            <BasicInfoFields form={form} setField={setField} destinations={destinations} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Highlights</h3>
            <HighlightsFields highlights={form.highlights} onUpdate={updateHighlight} onAdd={addHighlight} onRemove={removeHighlight} />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10">Save Changes</Button>
          <Button type="button" variant="outline" className="rounded-xl h-11 px-6 text-sm" asChild>
            <Link href="/packages">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

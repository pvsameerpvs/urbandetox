"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@urbandetox/ui";
import { Button } from "@urbandetox/ui";
import { createPackage } from "@/lib/admin-data";
import { useAdminDestinations } from "@/hooks/use-admin-data";
import { generateId } from "@/lib/id";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePackageForm } from "../components/use-package-form";
import { BasicInfoFields } from "../components/basic-info-fields";
import { HighlightsFields } from "../components/highlights-fields";
import { ItineraryFields } from "../components/itinerary-fields";

export default function NewPackagePage() {
  const router = useRouter();
  const destinations = useAdminDestinations();

  const {
    form,
    setField,
    updateHighlight,
    addHighlight,
    removeHighlight,
    updateItineraryDay,
    updateActivity,
    addActivity,
    addDay,
    removeDay,
  } = usePackageForm(destinations[0]?.slug || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const durationLabel = `${form.duration} Days / ${form.duration - 1} Nights`;
    createPackage({
      ...form,
      id: generateId("pkg"),
      slug,
      durationLabel,
      guideLed: true,
      featured: true,
      highlights: form.highlights.filter(Boolean),
      included: [""],
      notIncluded: [""],
      itinerary: form.itinerary.map((d) => ({ ...d, activities: d.activities.filter(Boolean) })),
    });
    router.push("/packages");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/packages" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Packages
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">New Package</h1>
      <p className="text-sm text-muted-foreground mb-6">Create a new detox package with full itinerary.</p>

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

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <ItineraryFields
              itinerary={form.itinerary}
              onUpdateDay={updateItineraryDay}
              onUpdateActivity={updateActivity}
              onAddActivity={addActivity}
              onAddDay={addDay}
              onRemoveDay={removeDay}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10">Create Package</Button>
          <Button type="button" variant="outline" className="rounded-xl h-11 px-6 text-sm" asChild>
            <Link href="/packages">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, Button } from "@urbandetox/ui";
import { createPackage } from "@/lib/admin-data";
import { useAdminDestinations } from "@/hooks/use-admin-data";
import { generateId } from "@/lib/id";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePackageForm } from "@/app/packages/components/use-package-form";
import { BasicInfoFields } from "@/app/packages/components/basic-info-fields";
import { HighlightsFields } from "@/app/packages/components/highlights-fields";
import { ArrayInput } from "@/app/packages/components/array-input";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { FaqsFields } from "@/app/packages/components/faqs-fields";
import { ItineraryFields } from "@/app/packages/components/itinerary-fields";

export default function NewPackagePage() {
  const router = useRouter();
  const destinations = useAdminDestinations();
  const f = usePackageForm(destinations[0]?.slug || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = f.form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
    const durationLabel = `${f.form.duration} Days / ${f.form.duration - 1} Nights`;
    createPackage({
      ...f.form,
      id: generateId("pkg"),
      slug,
      durationLabel,
      guideLed: true,
      featured: true,
      highlights: f.form.highlights.filter(Boolean),
      included: f.form.included.filter(Boolean),
      notIncluded: f.form.notIncluded.filter(Boolean),
      gallery: f.form.gallery.filter(Boolean),
      faqs: f.form.faqs.filter((q) => q.question && q.answer),
      itinerary: f.form.itinerary.map((d) => ({ ...d, activities: d.activities.filter(Boolean) })),
    });
    router.push("/packages");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/packages" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Packages
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">New Package</h1>
      <p className="text-sm text-muted-foreground mb-6">Create a new detox package with full itinerary and details.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Basic Info</h3>
            <BasicInfoFields form={f.form} setField={f.setField} destinations={destinations} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Included</h3>
              <ArrayInput items={f.form.included} onUpdate={f.updateIncluded} onAdd={f.addIncluded} onRemove={f.removeIncluded} placeholder="Included item" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Not Included</h3>
              <ArrayInput items={f.form.notIncluded} onUpdate={f.updateNotIncluded} onAdd={f.addNotIncluded} onRemove={f.removeNotIncluded} placeholder="Not included item" />
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Highlights</h3>
            <HighlightsFields highlights={f.form.highlights} onUpdate={f.updateHighlight} onAdd={f.addHighlight} onRemove={f.removeHighlight} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <ItineraryFields
              itinerary={f.form.itinerary}
              onUpdateDay={f.updateItineraryDay}
              onUpdateActivity={f.updateActivity}
              onAddActivity={f.addActivity}
              onAddDay={f.addDay}
              onRemoveDay={f.removeDay}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Gallery Images</h3>
            <GalleryUpload items={f.form.gallery} onAdd={f.addGallery} onRemove={f.removeGallery} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">FAQs</h3>
            <FaqsFields faqs={f.form.faqs} onUpdate={f.updateFaq} onAdd={f.addFaq} onRemove={f.removeFaq} />
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

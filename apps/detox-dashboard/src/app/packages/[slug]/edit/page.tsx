"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, Button } from "@urbandetox/ui";
import { updatePackage } from "@/lib/admin-data";
import { useAdminPackage, useAdminDestinations } from "@/hooks/use-admin-data";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { usePackageForm, type PackageFormData } from "@/app/packages/components/use-package-form";
import { BasicInfoFields } from "@/app/packages/components/basic-info-fields";
import { HighlightsFields } from "@/app/packages/components/highlights-fields";
import { ArrayInput } from "@/app/packages/components/array-input";
import { GalleryUpload } from "@/components/shared/GalleryUpload";
import { FaqsFields } from "@/app/packages/components/faqs-fields";
import { ItineraryFields } from "@/app/packages/components/itinerary-fields";

export default function EditPackagePage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug);
  const { data: pkg } = useAdminPackage(slug);
  const { data: destinations } = useAdminDestinations();
  const f = usePackageForm(pkg?.destinationSlug || "", {
    title: pkg?.title,
    subtitle: pkg?.subtitle,
    destinationSlug: pkg?.destinationSlug,
    duration: pkg?.duration,
    startingPrice: pkg?.startingPrice,
    groupSize: pkg?.groupSize,
    style: pkg?.style,
    seasonalTag: pkg?.seasonalTag,
    coverImage: pkg?.coverImage,
    highlights: pkg?.highlights,
    itinerary: pkg?.itinerary,
    included: pkg?.included,
    notIncluded: pkg?.notIncluded,
    gallery: pkg?.gallery,
    faqs: pkg?.faqs,
  });

  if (!pkg) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Package not found</h2>
        <Link href="/packages" className="text-brand hover:underline">Back to Packages</Link>
      </div>
    );
  }

  async function onSubmit(data: PackageFormData) {
    const durationLabel = `${data.duration} Days / ${data.duration - 1} Nights`;
    try {
      await updatePackage(slug, {
      ...data,
      durationLabel,
      highlights: data.highlights.filter(Boolean),
      included: data.included.filter(Boolean),
      notIncluded: data.notIncluded.filter(Boolean),
      gallery: data.gallery.filter(Boolean),
      faqs: data.faqs.filter((q) => q.question && q.answer),
      itinerary: data.itinerary.map((d) => ({ ...d, activities: d.activities.filter(Boolean) })),
    });
    toast.success("Package updated successfully");
      router.push("/packages");
    } catch {
      toast.error("Failed to update package");
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/packages" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Packages
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Package</h1>
      <p className="text-sm text-muted-foreground mb-6">Update {pkg.title} details.</p>

      <form onSubmit={f.form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Basic Info</h3>
            <BasicInfoFields control={f.form.control} destinations={destinations} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Included</h3>
              <ArrayInput items={f.included} onUpdate={(i, v) => f.updateArrayItem("included", i, v)} onAdd={() => f.appendArrayItem("included", "")} onRemove={(i) => f.removeArrayItem("included", i)} placeholder="Included item" />
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Not Included</h3>
              <ArrayInput items={f.notIncluded} onUpdate={(i, v) => f.updateArrayItem("notIncluded", i, v)} onAdd={() => f.appendArrayItem("notIncluded", "")} onRemove={(i) => f.removeArrayItem("notIncluded", i)} placeholder="Not included item" />
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Highlights</h3>
            <HighlightsFields highlights={f.highlights} onUpdate={(i, v) => f.updateArrayItem("highlights", i, v)} onAdd={() => f.appendArrayItem("highlights", "")} onRemove={(i) => f.removeArrayItem("highlights", i)} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <ItineraryFields
              itinerary={f.itinerary}
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
            <GalleryUpload items={f.gallery} onAdd={(v) => f.appendArrayItem("gallery", v)} onRemove={(i) => f.removeArrayItem("gallery", i)} folder="packages/gallery" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">FAQs</h3>
            <FaqsFields faqs={f.faqs} onUpdate={f.updateFaq} onAdd={f.appendFaq} onRemove={f.removeFaq} />
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

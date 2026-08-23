"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { updateDestination } from "@/lib/admin-data";
import { useAdminDestination } from "@/hooks/use-admin-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { DestinationForm, type DestinationFormData } from "../../components/DestinationForm";
import { normalizeDestinationPayload } from "@/app/destinations/components/normalize";

export default function EditDestinationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug);
  const { data: dest, loading } = useAdminDestination(slug);

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  }

  // The hook starts at its fallback and resolves asynchronously, so this
  // not-found branch used to render on the very first paint, and stuck
  // permanently if the fetch failed.
  if (!dest) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Destination not found</h2>
        <Link href="/destinations" className="text-brand hover:underline">Back to Destinations</Link>
      </div>
    );
  }

  async function handleSubmit(data: DestinationFormData) {
    try {
      await updateDestination(slug, {
        ...normalizeDestinationPayload(data),
        gallery: data.gallery.filter(Boolean),
      });
      toast.success("Destination updated successfully");
      router.push("/destinations");
    } catch {
      toast.error("Failed to update destination");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader backHref="/destinations" backLabel="Back to Destinations" title="Edit Destination" subtitle={`Update ${dest.name} details.`} />
      <DestinationForm
        mode="edit"
        initialData={dest}
        slugValue={slug}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        cancelHref="/destinations"
      />
    </div>
  );
}

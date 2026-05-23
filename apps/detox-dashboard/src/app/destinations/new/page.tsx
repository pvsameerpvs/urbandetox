"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDestination } from "@/lib/admin-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { DestinationForm, type DestinationFormData } from "../components/DestinationForm";

export default function NewDestinationPage() {
  const router = useRouter();

  async function handleSubmit(data: DestinationFormData) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    try {
      await createDestination({
        ...data,
        slug,
        gallery: data.gallery.filter(Boolean),
      });
      toast.success("Destination created successfully");
      router.push("/destinations");
    } catch {
      toast.error("Failed to create destination");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader backHref="/destinations" backLabel="Back to Destinations" title="New Destination" subtitle="Create a new detox destination." />
      <DestinationForm
        mode="create"
        slugValue=""
        onSubmit={handleSubmit}
        submitLabel="Create Destination"
        cancelHref="/destinations"
      />
    </div>
  );
}

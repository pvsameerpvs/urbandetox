"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { updateDeparture } from "@/lib/admin-data";
import { useAdminDepartures, useAdminPackages, useAdminDestinations } from "@/hooks/use-admin-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { DepartureForm, type DepartureFormData } from "../../components/form";

export default function EditDeparturePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const { data: allDeps } = useAdminDepartures();
  const { data: packages } = useAdminPackages();
  const { data: destinations } = useAdminDestinations();
  const dep = allDeps.find((d) => d.id === id);

  if (!dep) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Departure not found</h2>
        <Link href="/departures" className="text-brand hover:underline">Back to Departures</Link>
      </div>
    );
  }

  async function handleSubmit(data: DepartureFormData) {
    try {
      await updateDeparture(id, data);
      toast.success("Departure updated successfully");
      router.push("/departures");
    } catch {
      toast.error("Failed to update departure");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader backHref="/departures" backLabel="Back to Departures" title="Edit Departure" subtitle={`Update ${dep.code} details.`} />
      <DepartureForm mode="edit" initialData={dep} onSubmit={handleSubmit} submitLabel="Save Changes" cancelHref="/departures" packages={packages} destinations={destinations} />
    </div>
  );
}

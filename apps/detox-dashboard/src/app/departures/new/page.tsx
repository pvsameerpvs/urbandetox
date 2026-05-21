"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDeparture } from "@/lib/admin-data";
import { useAdminPackages, useAdminDestinations } from "@/hooks/use-admin-data";
import { generateId } from "@/lib/id";
import { PageHeader } from "@/components/ui/PageHeader";
import { DepartureForm, type DepartureFormData } from "../components/DepartureForm";

export default function NewDeparturePage() {
  const router = useRouter();
  const packages = useAdminPackages();
  const destinations = useAdminDestinations();

  function handleSubmit(data: DepartureFormData) {
    try {
      createDeparture({
        ...data,
        id: generateId("dep"),
      });
      toast.success("Departure created successfully");
      router.push("/departures");
    } catch {
      toast.error("Failed to create departure");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader backHref="/departures" backLabel="Back to Departures" title="New Departure" subtitle="Add trip dates for a package." />
      <DepartureForm mode="create" onSubmit={handleSubmit} submitLabel="Create Departure" cancelHref="/departures" packages={packages} destinations={destinations} />
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@urbandetox/ui";
import { Button } from "@urbandetox/ui";
import { MapPin, ArrowRight, Plus } from "lucide-react";
import { getPackagesByDestination, deleteDestination } from "@/lib/admin-data";
import { useAdminDestinations } from "@/hooks/use-admin-data";
import { safeImageUrl } from "@/lib/image-url";

export default function DestinationsPage() {
  const destinations = useAdminDestinations();

  const handleDelete = (slug: string) => {
    if (confirm("Delete this destination and all its packages?")) {
      deleteDestination(slug);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Destinations</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage detox destinations and their packages.</p>
        </div>
        <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
          <Link href="/destinations/new"><Plus className="mr-1.5 h-4 w-4" /> New</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((dest) => {
          const pkgCount = getPackagesByDestination(dest.slug).length;
          return (
            <Card key={dest.slug} className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 group">
              <div className="relative h-[180px] overflow-hidden">
                <Image src={safeImageUrl(dest.image)} alt={dest.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="h-3.5 w-3.5 text-brand" />
                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{dest.region}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{dest.name}</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{dest.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{pkgCount} package{pkgCount > 1 ? "s" : ""}</span>
                  <div className="flex items-center gap-2">
                    <Link href={`/destinations/${dest.slug}/edit`} className="text-xs font-semibold text-brand hover:text-brand/80 inline-flex items-center gap-1 transition-colors">
                      Edit <ArrowRight className="h-3 w-3" />
                    </Link>
                    <button onClick={() => handleDelete(dest.slug)} className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { fetchPackageBySlug, fetchDestinationBySlug } from "@/lib/data";
import { formatPrice } from "@urbandetox/utils";
import { MapPin, Clock, ArrowRight } from "lucide-react";

interface PackageLinkProps {
  slug: string;
}

export function RelatedPackageCard({ slug }: PackageLinkProps) {
  const pkg = fetchPackageBySlug(slug);
  const dest = pkg ? fetchDestinationBySlug(pkg.destinationSlug) : undefined;
  if (!pkg) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/detox/${dest?.slug}/${pkg.slug}`} className="group block">
        <Card className="overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white hover:shadow-xl transition-all duration-500">
          <div className="flex flex-col sm:flex-row">
            <div className="relative h-44 sm:h-auto sm:w-40 shrink-0 overflow-hidden">
              <Image
                src={pkg.coverImage}
                alt={pkg.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="200px"
              />
            </div>
            <CardContent className="p-4 sm:p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                <MapPin className="h-3 w-3" /> {dest?.name}
              </div>
              <h3 className="text-sm font-bold mb-1.5 group-hover:text-brand transition-colors">{pkg.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Clock className="h-3 w-3" /> {pkg.durationLabel}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-brand">{formatPrice(pkg.startingPrice)}</span>
                <span className="text-xs font-semibold text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

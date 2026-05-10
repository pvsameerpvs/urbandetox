"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { MapPin, Clock, Calendar as CalendarIcon, Users, ArrowRight } from "lucide-react";

interface PackageCardProps {
  image: string;
  title: string;
  subtitle: string;
  destinationName: string;
  durationLabel: string;
  groupSize: string;
  startingPrice: number;
  totalDepartures: number;
  slug: string;
  nextDeparture?: { status: string; seatsLeft: number; startDate: string; endDate: string } | null;
}

function StatusBadge({ status, seatsLeft }: { status: string; seatsLeft: number }) {
  if (status === "full") {
    return <Badge variant="secondary" className="bg-muted/80 text-muted-foreground backdrop-blur-sm text-xs">Full</Badge>;
  }
  if (status === "filling") {
    return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">{seatsLeft} left</Badge>;
  }
  return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">{seatsLeft} left</Badge>;
}

export function PackageCard({
  image, title, subtitle, destinationName, durationLabel, groupSize, startingPrice, totalDepartures, slug, nextDeparture,
}: PackageCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <Card className={cn("group overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white !gap-0 !py-0", "hover:shadow-xl transition-all duration-500")}>
        <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
          <Image src={image} alt={title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <Badge className="bg-white/95 text-foreground shadow-sm font-medium text-xs backdrop-blur-sm">
              <MapPin className="mr-1 h-3 w-3" /> {destinationName}
            </Badge>
            {nextDeparture && <StatusBadge status={nextDeparture.status} seatsLeft={nextDeparture.seatsLeft} />}
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
              <Clock className="h-3.5 w-3.5" /> {durationLabel}
            </div>
          </div>
        </div>

        <CardContent className="p-5 sm:p-6">
          <h3 className="text-lg font-bold leading-snug mb-1.5">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{subtitle}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {durationLabel}</span>
            <span className="inline-flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> {totalDepartures} upcoming</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {groupSize}</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-brand">{formatPrice(startingPrice)}</span>
              <span className="ml-1 text-xs text-muted-foreground">starting</span>
            </div>
            <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
              <Link href={`/detox/${slug}`}>View <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          {nextDeparture && (
            <div className="mt-3 rounded-md bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              Next: <span className="font-medium text-foreground">{formatDateRange(nextDeparture.startDate, nextDeparture.endDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

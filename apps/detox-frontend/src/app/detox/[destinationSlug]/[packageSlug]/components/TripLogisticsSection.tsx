"use client";

import { motion } from "framer-motion";
import {
  Bus,
  Clock,
  Home,
  Info,
  MapPin,
  Backpack,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui";
import type { Package } from "@urbandetox/utils";
import { LogisticsListCard } from "./LogisticsListCard";
import { PickupMapBlock } from "./PickupMapBlock";

interface TripLogisticsSectionProps {
  pkg: Package;
}

export function TripLogisticsSection({ pkg }: TripLogisticsSectionProps) {
  const rows = [
    { icon: MapPin, label: "Pickup point", value: pkg.pickupPoint },
    { icon: MapPin, label: "Drop point", value: pkg.dropPoint },
    { icon: Clock, label: "Pickup time", value: pkg.pickupTime },
    { icon: Clock, label: "Return time", value: pkg.returnTime },
    { icon: Bus, label: "Transport", value: pkg.transportType },
    { icon: Home, label: "Stay", value: pkg.stayType },
    { icon: Users, label: "Room sharing", value: pkg.roomSharing },
    { icon: UtensilsCrossed, label: "Meals", value: pkg.mealPlan },
  ].filter((r) => Boolean(r.value));

  const whatToPack = (pkg.whatToPack ?? []).filter(Boolean);
  const thingsToKnow = (pkg.thingsToKnow ?? []).filter(Boolean);
  const hasMap = Boolean(pkg.pickupMapImage || pkg.pickupMapUrl);

  // Nothing filled in yet for this trip, so render nothing rather than an empty shell.
  if (rows.length === 0 && whatToPack.length === 0 && thingsToKnow.length === 0 && !hasMap) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Practical Details
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        Good to <span className="text-brand">Know</span>
      </h2>

      <div className="grid grid-cols-1 gap-5">
        {/* Was gated on rows.length alone, so a package with a pickup map but
            no other logistics rows passed the section-level check above (which
            does account for hasMap) and then rendered an empty card. */}
        {(rows.length > 0 || hasMap) && (
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-5 sm:p-6">
              {rows.length > 0 && (
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {rows.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                      <Icon className="h-4 w-4 text-brand" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="text-sm font-medium break-words">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              )}

              <PickupMapBlock
                mapImage={pkg.pickupMapImage}
                mapUrl={pkg.pickupMapUrl}
                packageTitle={pkg.title}
              />
            </CardContent>
          </Card>
        )}

        {(whatToPack.length > 0 || thingsToKnow.length > 0) && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {whatToPack.length > 0 && (
              <LogisticsListCard icon={Backpack} title="What to Pack" items={whatToPack} />
            )}
            {thingsToKnow.length > 0 && (
              <LogisticsListCard icon={Info} title="Things to Know" items={thingsToKnow} />
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}


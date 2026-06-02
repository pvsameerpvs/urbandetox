"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, Badge, Button } from "@urbandetox/ui";
import { formatPrice, formatDateRange, formatTime } from "@urbandetox/utils";
import type { Departure } from "@urbandetox/utils";
import { Calendar, Check, Clock } from "lucide-react";

interface DeparturesSectionProps {
  departures: Departure[];
  selectedCode?: string;
}

export function DeparturesSection({ departures, selectedCode }: DeparturesSectionProps) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Dates</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Upcoming <span className="text-brand">Departures</span></h2>

      {departures.length === 0 ? (
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
            <h4 className="font-bold mb-1">No departures available</h4>
            <p className="text-sm text-muted-foreground">Check back soon for new dates.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {departures.map((dep) => {
            const isFull = dep.status === "full";
            const isFilling = dep.status === "filling";
            const isSelected = selectedCode === dep.code;
            return (
              <Card
                key={dep.id}
                className={`border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl hover:shadow-md transition-all duration-300 ${isSelected ? "ring-2 ring-brand bg-brand/[0.02]" : ""}`}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  {dep.image && (
                    <div className="relative w-full sm:w-20 h-32 sm:h-20 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={dep.image}
                        alt="Departure cover"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Calendar className="h-4 w-4 text-brand shrink-0" />
                      <span className="text-sm font-bold">{formatDateRange(dep.startDate, dep.endDate)}</span>
                      {dep.startTime && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(dep.startTime)}
                          {dep.endTime && ` - ${formatTime(dep.endTime)}`}
                        </span>
                      )}
                      {isSelected && (
                        <Badge className="bg-brand text-brand-foreground border-0 text-[10px] font-medium flex items-center gap-1">
                          <Check className="h-3 w-3" /> Selected
                        </Badge>
                      )}
                      {isFilling && !isSelected && <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-medium">Filling Fast</Badge>}
                      {isFull && <Badge variant="secondary" className="text-[10px]">Full</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-brand">{formatPrice(dep.offerPrice ?? dep.price)}</span>
                      {dep.offerPrice && dep.offerPrice < dep.price && (
                        <span className="text-muted-foreground line-through text-xs">{formatPrice(dep.price)}</span>
                      )}
                      <span className="text-xs text-muted-foreground">· {dep.seatsLeft} seats left</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] h-10 px-5 text-xs font-semibold shrink-0"
                    disabled={isFull}
                    asChild
                  >
                    <Link href={`/book/${dep.code}`}>{isFull ? "Waitlist" : "Book This Detox"}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}

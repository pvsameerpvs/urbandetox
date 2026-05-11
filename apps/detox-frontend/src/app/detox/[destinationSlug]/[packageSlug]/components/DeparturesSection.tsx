"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { Calendar } from "lucide-react";

interface Departure {
  id: string;
  code: string;
  startDate: string;
  endDate: string;
  status: string;
  seatsLeft: number;
  price: number;
  offerPrice?: number;
}

interface DeparturesSectionProps {
  departures: Departure[];
}

export function DeparturesSection({ departures }: DeparturesSectionProps) {
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
            return (
              <Card key={dep.id} className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl hover:shadow-md transition-all duration-300">
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar className="h-4 w-4 text-brand shrink-0" />
                      <span className="text-sm font-bold">{formatDateRange(dep.startDate, dep.endDate)}</span>
                      {isFilling && <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] font-medium">Filling Fast</Badge>}
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
                    className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-5 text-xs font-semibold shrink-0"
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

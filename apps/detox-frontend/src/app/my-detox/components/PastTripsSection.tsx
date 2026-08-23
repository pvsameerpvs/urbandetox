"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TripCard } from "./TripCard";
import type { Trip } from "./TripCard";

export function PastTripsSection({ trips, highlightedBookingId }: { trips: Trip[]; highlightedBookingId?: string | null }) {
  const past = trips.filter((t) => t.status === "completed" || t.status === "cancelled");
  const highlightedPast = past.some((trip) => trip.id === highlightedBookingId);
  const [open, setOpen] = useState(highlightedPast);

  useEffect(() => {
    if (highlightedPast) setOpen(true);
  }, [highlightedPast]);

  if (past.length === 0) return null;

  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4">
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        Past Trips ({past.length})
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="space-y-4 overflow-hidden">
            {past.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} index={index} highlighted={trip.id === highlightedBookingId} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

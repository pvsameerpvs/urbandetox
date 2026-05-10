"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DESTINATIONS, DURATIONS } from "@/lib/constants";
import { MapPin, Clock, Calendar as CalendarIcon, Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isAfter, startOfToday } from "date-fns";
import { useState } from "react";

interface FilterBarProps {
  destination: string;
  setDestination: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  resultCount: number;
}

export function FilterBar({ destination, setDestination, duration, setDuration, selectedDate, setSelectedDate, resultCount }: FilterBarProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const selectedDateObj = selectedDate ? parseISO(selectedDate) : undefined;
  const selectedDateLabel = selectedDateObj ? format(selectedDateObj, "MMM d, yyyy") : "Pick a date";
  const hasFilters = destination !== "all" || duration !== "all" || selectedDate !== "";

  const handleReset = () => {
    setDestination("all");
    setDuration("all");
    setSelectedDate("");
  };

  const destLabel = DESTINATIONS.find((d) => d.value === destination)?.label || "All Destinations";
  const durLabel = DURATIONS.find((d) => d.value === duration)?.label || "Any Duration";

  return (
    <div className="relative min-h-[85vh] sm:min-h-[75vh] flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <Image src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop" alt="Explore Detox" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-white/40" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Discover</span>
            <span className="h-px w-8 bg-white/40" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-5">Find Your Next <span className="text-white/80">Detox</span></h1>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto mb-2">Browse handpicked offbeat escapes. Filter by destination, date, or duration to find your reset.</p>
          <p className="text-sm text-white/50">{resultCount} {resultCount === 1 ? "package" : "packages"} available</p>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/15 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Destination</label>
                <Select value={destination} onValueChange={(v) => setDestination(v || "all")}>
                  <SelectTrigger className="h-12 bg-secondary/50 border-0 rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Where to?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {DESTINATIONS.filter((d) => d.value !== "all").map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Travel Date</label>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <button className={cn("w-full h-12 flex items-center gap-2 px-3 rounded-xl text-sm font-medium transition-colors text-left", "bg-secondary/50 hover:bg-secondary", selectedDate ? "text-foreground" : "text-muted-foreground")}>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{selectedDateLabel}</span>
                      <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={selectedDateObj} onSelect={(date) => { setSelectedDate(date ? format(date, "yyyy-MM-dd") : ""); setDateOpen(false); }} disabled={(date) => !isAfter(date, startOfToday())} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Duration</label>
                <Select value={duration} onValueChange={(v) => setDuration(v || "all")}>
                  <SelectTrigger className="h-12 bg-secondary/50 border-0 rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="How long?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Duration</SelectItem>
                    {DURATIONS.filter((d) => d.value !== "all").map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                {hasFilters && (
                  <Button variant="outline" onClick={handleReset} className="h-12 rounded-xl border-border/60 text-muted-foreground hover:text-foreground flex-1">
                    <X className="mr-1.5 h-4 w-4" /> Reset
                  </Button>
                )}
                <Button className="h-12 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 flex-1 shadow-lg shadow-brand/10">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/40">
                <span className="text-xs text-muted-foreground mr-1">Active:</span>
                {destination !== "all" && (
                  <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-normal cursor-pointer hover:bg-muted" onClick={() => setDestination("all")}>
                    {destLabel} <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {selectedDate && (
                  <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-normal cursor-pointer hover:bg-muted" onClick={() => setSelectedDate("")}>
                    {selectedDateLabel} <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
                {duration !== "all" && (
                  <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-normal cursor-pointer hover:bg-muted" onClick={() => setDuration("all")}>
                    {durLabel} <X className="ml-1 h-3 w-3" />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

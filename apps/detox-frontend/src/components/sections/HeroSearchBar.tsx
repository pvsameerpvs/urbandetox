"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, isAfter, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Clock, ChevronDown, Search, X } from "lucide-react";
import { DESTINATIONS, DURATIONS } from "@urbandetox/utils";
import type { Departure } from "@urbandetox/utils";
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@urbandetox/ui";
import { HeroCalendarDay } from "./HeroCalendarDay";

interface HeroSearchBarProps {
  departures: Departure[];
}

export function HeroSearchBar({ departures }: HeroSearchBarProps) {
  const router = useRouter();

  const [destination, setDestination] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState("all");

  const departureDatesMap = useMemo(() => {
    const map: Record<string, { status: string; seatsLeft: number; code: string }> = {};
    departures.forEach((dep) => {
      map[dep.startDate] = {
        status: dep.status,
        seatsLeft: dep.seatsLeft,
        code: dep.code,
      };
    });
    return map;
  }, [departures]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination && destination !== "all") params.set("destination", destination);
    if (selectedDate) params.set("date", format(selectedDate, "yyyy-MM-dd"));
    if (duration && duration !== "all") params.set("duration", duration);
    router.push(`/detox?${params.toString()}`);
  };

  const selectedDateLabel = selectedDate
    ? format(selectedDate, "MMM d, yyyy")
    : "Select date";

  const destLabel = DESTINATIONS.find((d) => d.value === destination)?.label || "All Destinations";
  const durLabel = DURATIONS.find((d) => d.value === duration)?.label || "Any Duration";

  return (
    <div className="relative w-full px-4 pb-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="bg-white rounded-xl shadow-2xl shadow-black/20 border border-white/60 overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Destination */}
          <div className="flex-1 p-4 lg:border-r border-border/50 hover:bg-secondary/20 transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              <MapPin className="h-3 w-3" /> Where
            </label>
            <Select value={destination} onValueChange={(val) => setDestination(val ?? "all")}>
              <SelectTrigger className="w-full border-0 bg-transparent h-8 text-sm font-bold p-0 focus:ring-0 shadow-none [&>svg]:hidden">
                <SelectValue placeholder="All Destinations">
                  <span className="text-foreground">{destLabel}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-0.5">Choose your escape</p>
          </div>

          {/* When - Calendar Popover */}
          <div className="flex-1 p-4 lg:border-r border-border/50 hover:bg-secondary/20 transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              <CalendarDays className="h-3 w-3" /> When
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full text-left flex items-center justify-between group">
                  <span className={`text-sm font-bold ${selectedDate ? "text-foreground" : "text-muted-foreground"}`}>
                    {selectedDateLabel}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Select a departure date</p>
                    {selectedDate && (
                      <button
                        onClick={() => setSelectedDate(undefined)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                      >
                        <X className="h-3 w-3" /> Clear
                      </button>
                    )}
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const key = format(date, "yyyy-MM-dd");
                      const dep = departureDatesMap[key];
                      return !dep || dep.status === "full" || !isAfter(date, startOfToday());
                    }}
                    className="rounded-md border-0"
                    components={{
                      DayContent: (props: { date: Date }) => (
                        <HeroCalendarDay
                          date={props.date}
                          departureDatesMap={departureDatesMap}
                          selectedDate={selectedDate}
                        />
                      ),
                    }}
                  />
                  <div className="flex items-center gap-4 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Available</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Filling Fast</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted" /> Full</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {selectedDate && departureDatesMap[format(selectedDate, "yyyy-MM-dd")]
                ? `${departureDatesMap[format(selectedDate, "yyyy-MM-dd")].seatsLeft} seats left`
                : "Add your travel dates"}
            </p>
          </div>

          {/* Duration */}
          <div className="flex-1 p-4 lg:border-r border-border/50 hover:bg-secondary/20 transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              <Clock className="h-3 w-3" /> Duration
            </label>
            <Select value={duration} onValueChange={(val) => setDuration(val ?? "all")}>
              <SelectTrigger className="w-full border-0 bg-transparent h-8 text-sm font-bold p-0 focus:ring-0 shadow-none [&>svg]:hidden">
                <SelectValue placeholder="Any Duration">
                  <span className="text-foreground">{durLabel}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-0.5">How long is your break?</p>
          </div>

          {/* Search Button */}
          <div className="p-2 lg:p-3 flex items-center justify-center">
            <Button
              className="w-full lg:w-12 lg:h-12 bg-brand text-brand-foreground hover:bg-brand/90 rounded-xl lg:rounded-xl shadow-lg shadow-brand/20 shrink-0"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

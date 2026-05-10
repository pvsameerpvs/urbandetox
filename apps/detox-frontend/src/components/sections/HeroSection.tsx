"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, CalendarDays, Clock, ChevronDown, Search, X } from "lucide-react";
import { DESTINATIONS, DURATIONS } from "@/lib/constants";
import { fetchUpcomingDepartures } from "@/lib/data";
import { format, isAfter, startOfToday } from "date-fns";

export function HeroSection() {
  const router = useRouter();
  const departures = fetchUpcomingDepartures(50);

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
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop"
          alt="Urban Detox - Nature escape"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Content - pt-24 for fixed navbar */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 pt-24 sm:pt-28 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center text-white max-w-3xl mx-auto"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 mb-5 border border-white/20"
          >
            
            <span className="text-sm font-semibold tracking-wide uppercase">Curated Offbeat Escapes</span>
          </motion.div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance leading-[1.15]">
            Disconnect from routine.
            <span className="block mt-1.5 text-brand-foreground">Step into your next detox.</span>
          </h1>
          <p className="mt-4 text-base leading-7 text-white/70 text-balance max-w-lg mx-auto">
            Small-group escapes to the Western Ghats, Kerala, and beyond. 
            Local stays, guided stillness, and real reset.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-bold px-7 h-11 text-sm shadow-lg shadow-white/10 uppercase tracking-wide"
              asChild
            >
              <Link href="/detox">
                Explore Detox <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent h-11 px-5 text-sm"
              asChild
            >
              <Link href="/detox">View Upcoming</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Search Bar - compact at bottom */}
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
                <SelectContent className="z-[100]">
                  {DESTINATIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
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
                        DayContent: (props: { date: Date }) => {
                          const key = format(props.date, "yyyy-MM-dd");
                          const dep = departureDatesMap[key];
                          const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === key;
                          return (
                            <div className={`relative w-full h-full flex items-center justify-center rounded-full ${isSelected ? "bg-brand text-brand-foreground" : ""}`}>
                              <span>{props.date.getDate()}</span>
                              {dep && dep.status !== "full" && (
                                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${
                                  dep.status === "filling" ? "bg-amber-500" : "bg-emerald-500"
                                }`} />
                              )}
                            </div>
                          );
                        },
                      }}
                    />
                    <div className="flex items-center gap-4 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-500" /> Filling Fast
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted" /> Full
                      </span>
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
                <SelectContent className="z-[100]">
                  {DURATIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
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
    </section>
  );
}

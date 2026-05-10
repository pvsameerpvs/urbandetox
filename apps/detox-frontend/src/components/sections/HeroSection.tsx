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
import { format, parseISO, isAfter, startOfToday } from "date-fns";

export function HeroSection() {
  const router = useRouter();
  const departures = fetchUpcomingDepartures(50);

  const [destination, setDestination] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState("all");

  // Build available dates map
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
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Center Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center text-white max-w-3xl mx-auto"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 mb-6 border border-white/20"
          >
            <Image
              src="/log-detox.png"
              alt="Urban Detox"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span className="text-sm font-medium">Curated Offbeat Escapes</span>
          </motion.div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl text-balance leading-[1.15]">
            Disconnect from routine.
            <span className="block mt-2 text-brand-foreground">Step into your next detox.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/70 text-balance max-w-xl mx-auto">
            Small-group escapes to the Western Ghats, Kerala, and beyond. 
            Local stays, guided stillness, and real reset.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-medium px-8 h-12 text-base shadow-lg shadow-white/10"
              asChild
            >
              <Link href="/detox">
                Explore Detox <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent h-12 px-6"
              asChild
            >
              <Link href="/detox">View Upcoming</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="relative mx-auto max-w-5xl w-full px-4 pb-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-white/60 overflow-hidden"
        >
          {/* Desktop: horizontal, Mobile: stacked */}
          <div className="flex flex-col lg:flex-row">
            
            {/* Destination */}
            <div className="flex-1 p-5 lg:border-r border-border/50 hover:bg-secondary/20 transition-colors">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <MapPin className="h-3.5 w-3.5" /> Where
              </label>
              <Select value={destination} onValueChange={(val) => setDestination(val ?? "all")}>
                <SelectTrigger className="w-full border-0 bg-transparent h-9 text-base font-semibold p-0 focus:ring-0 shadow-none [&>svg]:hidden">
                  <SelectValue placeholder="All Destinations">
                    <span className="flex items-center gap-2">
                      <span className="text-foreground">{destLabel}</span>
                    </span>
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
              <p className="text-xs text-muted-foreground mt-1">Choose your escape</p>
            </div>

            {/* When - Calendar Popover */}
            <div className="flex-1 p-5 lg:border-r border-border/50 hover:bg-secondary/20 transition-colors">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <CalendarDays className="h-3.5 w-3.5" /> When
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full text-left flex items-center justify-between group">
                    <div>
                      <span className={`text-base font-semibold ${selectedDate ? "text-foreground" : "text-muted-foreground"}`}>
                        {selectedDateLabel}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Select a departure date</p>
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
              <p className="text-xs text-muted-foreground mt-1">
                {selectedDate && departureDatesMap[format(selectedDate, "yyyy-MM-dd")]
                  ? `${departureDatesMap[format(selectedDate, "yyyy-MM-dd")].seatsLeft} seats left`
                  : "Add your travel dates"}
              </p>
            </div>

            {/* Duration */}
            <div className="flex-1 p-5 lg:border-r border-border/50 hover:bg-secondary/20 transition-colors">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <Clock className="h-3.5 w-3.5" /> Duration
              </label>
              <Select value={duration} onValueChange={(val) => setDuration(val ?? "all")}>
                <SelectTrigger className="w-full border-0 bg-transparent h-9 text-base font-semibold p-0 focus:ring-0 shadow-none [&>svg]:hidden">
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
              <p className="text-xs text-muted-foreground mt-1">How long is your break?</p>
            </div>

            {/* Search Button */}
            <div className="p-3 lg:p-3 flex items-center justify-center">
              <Button
                className="w-full lg:w-14 lg:h-14 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold rounded-xl lg:rounded-2xl shadow-lg shadow-brand/20 shrink-0"
                onClick={handleSearch}
              >
                <Search className="lg:h-5 lg:w-5 h-5 w-5 mr-2 lg:mr-0" />
                <span className="lg:hidden">Find Detox</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick stats below search bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-6 text-white/70 text-sm"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {departures.filter(d => d.status !== "full").length} upcoming trips
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            3 destinations
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Small groups (6-12)
          </span>
        </motion.div>
      </div>
    </section>
  );
}

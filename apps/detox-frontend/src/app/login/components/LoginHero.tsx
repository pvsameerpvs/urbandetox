"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Star, ArrowRight, Quote } from "lucide-react";

const stats = [
  { icon: MapPin, label: "Detoxes", value: "12+" },
  { icon: Users, label: "Travelers", value: "2,400+" },
  { icon: Star, label: "Rating", value: "4.9" },
];

const quotes = [
  { text: "The Kodaikanal detox changed my sleep cycle in 3 days.", author: "Priya M.", trip: "Kodai 3-Day" },
  { text: "Best offbeat experience. No crowds, just nature and calm.", author: "Rahul K.", trip: "North Kerala" },
];

export function LoginHero() {
  return (
    <div className="relative hidden lg:flex lg:w-[48%] xl:w-[42%] flex-col justify-between h-[100dvh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop"
        alt="Mountain retreat"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-sidebar-dark/85 via-sidebar-dark/50 to-sidebar-dark/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-sidebar-dark/90 via-transparent to-sidebar-dark/30" />

      <div className="relative z-10 p-8 xl:p-10">
        <Link href="/" className="inline-block">
          <Image src="/log-detox-white.png" alt="Urban Detox" width={140} height={42} className="h-11 w-auto object-contain" priority />
        </Link>
      </div>

      <div className="relative z-10 p-8 xl:p-10 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-2">Your Travel Partner</p>
          <h2 className="text-2xl xl:text-3xl font-bold text-white leading-tight mb-2">
            Mindful escapes,<br /><span className="text-brand">curated for you</span>
          </h2>
          <p className="text-sm text-white/60 max-w-xs leading-relaxed">
            Handpicked offbeat destinations, digital-detox itineraries, and zero planning stress.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex items-center gap-5">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm h-8 w-8">
                <s.icon className="h-3.5 w-3.5 text-brand" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-none">{s.value}</p>
                <p className="text-[10px] text-white/50 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Traveler Stories</p>
          {quotes.map((q, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-3">
              <div className="h-7 w-7 rounded-full bg-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                <Quote className="h-3 w-3 text-brand" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-white/85 leading-snug">&ldquo;{q.text}&rdquo;</p>
                <p className="text-[11px] text-white/40 mt-1">{q.author} · {q.trip}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
          <Link href="/detox" className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand/80 font-semibold transition-colors group">
            Explore detoxes <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

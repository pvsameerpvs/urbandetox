"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Testimonial } from "@urbandetox/utils";
import { Users, MapPin, UserRound, ArrowRight, Quote } from "lucide-react";
import { LOGIN_IMAGE } from "../login-image";

/**
 * Facts, not metrics. This panel used to show "12+ Detoxes", "2,400+ Travelers"
 * and a "4.9" rating, none of which came from anywhere. Everything here is
 * either a published policy or a positioning line we can stand behind.
 */
const FACTS = [
  { icon: Users, label: "Group size", value: "10 max" },
  { icon: MapPin, label: "Pickup", value: "Bengaluru" },
  { icon: UserRound, label: "Travelling solo", value: "Most are" },
];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export function LoginHero({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="relative hidden lg:flex lg:w-[48%] xl:w-[42%] flex-col justify-between lg:sticky lg:top-0 h-[100dvh] overflow-hidden">
      <Image
        src={LOGIN_IMAGE}
        alt="Two travellers at a viewpoint in Kodaikanal"
        fill
        sizes="(min-width: 1280px) 42vw, 48vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-sidebar-dark/85 via-sidebar-dark/45 to-sidebar-dark/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-sidebar-dark/95 via-transparent to-sidebar-dark/40" />

      <div className="relative z-10 p-8 xl:p-10">
        <Link href="/" className="inline-block">
          <Image src="/log-detox-white.png" alt="Urban Detox" width={140} height={42} className="h-11 w-auto object-contain" priority />
        </Link>
      </div>

      <div className="relative z-10 p-8 xl:p-10 space-y-7">
        <motion.div {...rise(0.2)}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-media mb-2">Small groups, south India</p>
          <h2 className="text-2xl xl:text-3xl font-bold text-white leading-tight mb-2">
            Offbeat places,<br /><span className="text-brand-on-media">without the planning</span>
          </h2>
          <p className="text-sm text-white/70 max-w-xs leading-relaxed">
            Ten people, places that are not on the usual list, and an itinerary someone else already sorted out.
          </p>
        </motion.div>

        <motion.div {...rise(0.4)} className="flex items-center gap-5">
          {FACTS.map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm h-8 w-8 shrink-0">
                <f.icon className="h-3.5 w-3.5 text-brand-on-media" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">{f.value}</p>
                <p className="text-[10px] text-white/60 mt-1">{f.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {testimonials.length > 0 && (
          <motion.div {...rise(0.6)} className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60">From people who went</p>
            {testimonials.map((t) => (
              <div key={t.id} className="flex items-start gap-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-3">
                <div className="h-7 w-7 rounded-full bg-brand-on-media/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Quote className="h-3 w-3 text-brand-on-media" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white/90 leading-snug line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-[11px] text-white/60 mt-1">
                    {t.name}
                    {t.location ? ` · ${t.location}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
          <Link href="/detox" className="inline-flex items-center gap-1.5 text-sm text-brand-on-media hover:text-brand-on-media/80 font-semibold transition-colors group">
            See where we go <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

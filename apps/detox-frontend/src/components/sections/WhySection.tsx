"use client";

;
import { Compass, Users, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@urbandetox/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Card, CardContent } from "@urbandetox/ui"

const reasons = [
  {
    num: "01",
    icon: Compass,
    title: "Offbeat curated escapes",
    description:
      "We skip the tourist traps. Every destination is chosen for quiet, beauty, and real disconnection.",
  },
  {
    num: "02",
    icon: Users,
    title: "Small-group energy",
    description:
      "Groups of 6 to 12 people. Intimate enough to make friends, small enough to stay personal.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "No planning stress",
    description:
      "We handle stays, local transport, meals, and activities. You just show up and breathe.",
  },
  {
    num: "04",
    icon: Sparkles,
    title: "Real reset from routine",
    description:
      "Guided silence, nature walks, and intentional downtime. Not a tour. A reset.",
  },
];

function ReasonCard({
  num,
  icon: Icon,
  title,
  description,
}: {
  num: string;
  icon: typeof Compass;
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card
        className={cn(
          "group h-full border-0 shadow-lg shadow-black/[0.03] bg-white",
          "hover:shadow-xl hover:shadow-black/[0.08] transition-all duration-500",
          "relative overflow-hidden"
        )}
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand/40 via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className="p-8 sm:p-10">
          {/* Number + Icon row */}
          <div className="flex items-start justify-between mb-6">
            <span className="text-4xl sm:text-5xl font-bold text-brand/10 group-hover:text-brand/20 transition-colors duration-500">
              {num}
            </span>
            <div className="rounded-2xl bg-brand/8 p-3.5 group-hover:bg-brand/12 transition-colors duration-500">
              <Icon className="h-6 w-6 text-brand" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 leading-snug">{title}</h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function WhySection() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                Why Us
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              Why{" "}
              <span className="text-brand">Urban Detox</span>
            </h2>
          </div>
          <div className="lg:flex lg:items-end">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Built for people who are tired of crowded itineraries and generic
              getaways. We design experiences that actually help you reset.
            </p>
          </div>
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {reasons.map((r) => (
            <ReasonCard key={r.num} {...r} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

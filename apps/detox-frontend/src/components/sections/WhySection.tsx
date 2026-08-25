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
    title: "Offbeat Places, Not Tourist Traps",
    description:
      "We avoid crowded tourist spots and take you to quieter forests, beaches, backwaters, and local trails.",
  },
  {
    num: "02",
    icon: Users,
    title: "Small Groups Only",
    description:
      "Each trip is limited to a small group, so the experience feels personal, safe, and easy to connect.",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Everything Is Planned",
    description:
      "Stay, food, local travel, activities, and trip flow are handled. You just show up.",
  },
  {
    num: "04",
    icon: Sparkles,
    title: "Built for a Real Reset",
    description:
      "No rushed sightseeing. No pressure. Just slow days, fresh air, good food, and space for your mind to rest.",
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

        <CardContent className="p-6 sm:p-7">
          {/* Number + Icon row */}
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl sm:text-4xl font-bold text-brand/10 group-hover:text-brand/20 transition-colors duration-500">
              {num}
            </span>
            <div className="rounded-2xl bg-brand/8 p-3 group-hover:bg-brand/12 transition-colors duration-500">
              <Icon className="h-6 w-6 text-brand" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-2 leading-snug">{title}</h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function WhySection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-10 sm:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                Why People Choose 
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
             Urban
              <span className="text-brand"> Detox</span>
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

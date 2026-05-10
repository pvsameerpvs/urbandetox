"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Compass, Users, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: Compass,
    title: "Offbeat curated escapes",
    description:
      "We skip the tourist traps. Every destination is chosen for quiet, beauty, and real disconnection.",
  },
  {
    icon: Users,
    title: "Small-group energy",
    description:
      "Groups of 6 to 12 people. Intimate enough to make friends, small enough to stay personal.",
  },
  {
    icon: ShieldCheck,
    title: "No planning stress",
    description:
      "We handle stays, local transport, meals, and activities. You just show up and breathe.",
  },
  {
    icon: Sparkles,
    title: "Real reset from routine",
    description:
      "Guided silence, nature walks, and intentional downtime. Not a tour. A reset.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function WhySection() {
  return (
    <section className="py-20 sm:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-xl"
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Why Urban Detox</h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Built for people who are tired of crowded itineraries and generic getaways.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {reasons.map((r) => (
            <motion.div key={r.title} variants={itemVariants}>
              <Card className="border-0 shadow-lg shadow-black/5 bg-card h-full hover:shadow-xl hover:shadow-black/10 transition-all duration-500 group">
                <CardContent className="p-7">
                  <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-brand/10 p-4 group-hover:bg-brand/15 transition-colors">
                    <r.icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{r.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

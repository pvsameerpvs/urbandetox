"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, Users, Heart, Leaf } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animations";

const features = [
  { icon: Compass, title: "Offbeat First", description: "We skip tourist traps. Every destination is chosen for quiet, beauty, and real disconnection. You will not find crowds here." },
  { icon: Users, title: "Small Groups", description: "6 to 12 people. Intimate enough to make friends, small enough to stay personal. No large buses, no forced socializing." },
  { icon: Heart, title: "Local Stays", description: "Family-run cottages and homestays. Clean, safe, and authentic. Not luxury, but real — with hosts who care." },
  { icon: Leaf, title: "Guided Stillness", description: "Nature walks, silence sessions, and intentional downtime. Not a tour. A reset. Every activity has a purpose." },
];



export function Differentiators() {
  return (
    <section className="py-16 sm:py-24 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-brand/60" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">What Sets Us Apart</span>
            <span className="h-px w-8 bg-brand/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">Built Different, <span className="text-brand">By Design</span></h2>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <motion.div key={f.title} variants={itemVariants}>
              <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl h-full hover:shadow-xl transition-all duration-500 group">
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-brand/10 p-4 group-hover:bg-brand/15 transition-colors">
                    <f.icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

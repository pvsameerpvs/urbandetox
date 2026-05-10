"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Heart,
  Leaf,
  ArrowRight,
  Mountain,
  Compass,
  Sunrise,
  Sparkles,
  Quote,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* ─── Hero ───────────────────────────────────── */
function AboutHero() {
  return (
    <div className="relative min-h-[85vh] sm:min-h-[75vh] flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop"
          alt="Mountain landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-white/40" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Our Story
            </span>
            <span className="h-px w-8 bg-white/40" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
            About <span className="text-white/80">Urban Detox</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            Born from a simple observation: people are exhausted by their own routines.
            We design short, offbeat escapes that help you disconnect from noise and reconnect with nature, stillness, and yourself.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Stats Bar ──────────────────────────────── */
function StatsBar() {
  const stats = [
    { label: "Detoxes Hosted", value: "50+", icon: Mountain },
    { label: "Happy Travelers", value: "600+", icon: Users },
    { label: "Destinations", value: "8", icon: MapPin },
    { label: "Years Running", value: "3", icon: Sunrise },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl">
              <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center">
                <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-brand/10 p-3">
                  <stat.icon className="h-5 w-5 text-brand" />
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Feature Card ───────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl h-full hover:shadow-xl transition-all duration-500 group">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-brand/10 p-4 group-hover:bg-brand/15 transition-colors">
            <Icon className="h-6 w-6 text-brand" />
          </div>
          <h3 className="text-lg font-bold mb-3">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ─── Story Section ──────────────────────────── */
function StorySection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Image */}
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop"
              alt="Forest trail"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent" />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-brand/60" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                How It Started
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
              From a Weekend Trip to a Movement
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Urban Detox began in 2023 as a series of informal weekend trips from Bangalore to Kodaikanal.
                A small group of friends realized that two days in the forest, with no agenda and no signal,
                changed their entire month.
              </p>
              <p>
                Word spread. More people wanted in. So we designed a system: curated destinations,
                local stays, small groups, and a clear intention — to help urban professionals reset
                without needing a 10-day vacation.
              </p>
              <p>
                Today, Urban Detox operates across the Western Ghats, North Kerala, and the Karnataka coast.
                We remain small, intentional, and committed to the original idea: real reset, real places, real people.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-normal">
                <MapPin className="mr-1 h-3 w-3" /> Western Ghats
              </Badge>
              <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-normal">
                <MapPin className="mr-1 h-3 w-3" /> North Kerala
              </Badge>
              <Badge variant="secondary" className="bg-secondary text-foreground text-xs font-normal">
                <MapPin className="mr-1 h-3 w-3" /> Karnataka Coast
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Differentiators ────────────────────────── */
function Differentiators() {
  const features = [
    {
      icon: Compass,
      title: "Offbeat First",
      description:
        "We skip tourist traps. Every destination is chosen for quiet, beauty, and real disconnection. You will not find crowds here.",
    },
    {
      icon: Users,
      title: "Small Groups",
      description:
        "6 to 12 people. Intimate enough to make friends, small enough to stay personal. No large buses, no forced socializing.",
    },
    {
      icon: Heart,
      title: "Local Stays",
      description:
        "Family-run cottages and homestays. Clean, safe, and authentic. Not luxury, but real — with hosts who care.",
    },
    {
      icon: Leaf,
      title: "Guided Stillness",
      description:
        "Nature walks, silence sessions, and intentional downtime. Not a tour. A reset. Every activity has a purpose.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-brand/60" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              What Sets Us Apart
            </span>
            <span className="h-px w-8 bg-brand/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Built Different, <span className="text-brand">By Design</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Quote Section ──────────────────────────── */
function QuoteSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -top-4 left-0 sm:left-8">
            <Quote className="h-16 w-16 text-brand/10" />
          </div>
          <Card className="border-0 shadow-xl shadow-black/[0.05] bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 lg:p-16">
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold leading-relaxed text-foreground mb-8">
                We do not sell vacations. We create space for people to remember who they are
                when the city noise stops.
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-secondary">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                    alt="Founder"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Urban Detox Team</p>
                  <p className="text-sm text-muted-foreground">Founded 2023, Bangalore</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA Section ────────────────────────────── */
function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
              alt="Mountain vista"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 py-16 sm:py-24 px-6 sm:px-12 text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-white/40" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Ready to Reset
              </span>
              <span className="h-px w-8 bg-white/40" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6 max-w-2xl mx-auto">
              Your Next Detox is Waiting
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto mb-8">
              Browse curated packages, pick your dates, and step into stillness.
              No crowds. No noise. Just you and the wild.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-xl bg-white text-foreground hover:bg-white/90 h-12 px-8 text-sm font-semibold shadow-xl"
                asChild
              >
                <Link href="/detox">
                  Explore Packages <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/30 text-white hover:bg-white/10 h-12 px-8 text-sm font-semibold backdrop-blur-sm"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Main Page ──────────────────────────────── */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <AboutHero />
      <StatsBar />
      <StorySection />
      <Differentiators />
      <QuoteSection />
      <CTASection />
    </main>
  );
}

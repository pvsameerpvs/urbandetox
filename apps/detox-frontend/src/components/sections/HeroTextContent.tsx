"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@urbandetox/ui";
import type { HeroText } from "@/lib/hero";

interface HeroTextContentProps {
  heroText: HeroText;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export function HeroTextContent({ heroText }: HeroTextContentProps) {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-4 pt-24 sm:pt-28 pb-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center text-white max-w-3xl mx-auto"
      >
        <motion.div variants={badgeVariants} className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-2 mb-5 border border-white/20">
          <span className="text-sm font-semibold tracking-wide uppercase">{heroText.badge}</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance leading-[1.15] text-white">
          {heroText.headline1}
          <span className="block mt-1.5 text-white">{heroText.headline2}</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-4 text-base leading-7 text-white text-balance max-w-lg mx-auto">
          {heroText.subheadline}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 font-bold px-7 h-11 text-sm shadow-lg shadow-white/10 tracking-wide"
            asChild
          >
            <Link href="/detox">
              {heroText.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent h-11 px-5 text-sm"
            asChild
          >
            <Link href="/detox">{heroText.ctaSecondary}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

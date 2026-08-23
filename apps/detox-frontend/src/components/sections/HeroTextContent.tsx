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

function MobileBreak({ text }: { text: string }) {
  const trimmed = text?.trim();
  if (!trimmed || trimmed.length > 40) return <>{text}</>;
  const words = trimmed.split(/\s+/);
  if (words.length < 3) return <>{text}</>;
  const mid = Math.ceil(words.length / 2);
  return (
    <>
      {words.slice(0, mid).join(" ")}
      {/* The space has to live outside the <br>, which is display:none from `sm`
          up. Without it the two halves ran together as "fromroutine." on
          desktop. A trailing space before a line break is invisible on mobile. */}
      {" "}
      <br className="sm:hidden" />
      {words.slice(mid).join(" ")}
    </>
  );
}

export function HeroTextContent({ heroText }: HeroTextContentProps) {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-end px-4 pt-24 sm:pt-28 pb-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center text-white max-w-3xl mx-auto translate-y-5 sm:translate-y-6"
      >
        <motion.div variants={badgeVariants} className="inline-flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md px-4 py-2 mb-6 border border-white/25">
          <span className="text-sm font-semibold tracking-wide uppercase">{heroText.badge}</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance leading-[1.15] text-white">
          <MobileBreak text={heroText.headline1} />
          {heroText.headline2?.trim() && (
            <span className="block mt-1.5 text-white">
              <MobileBreak text={heroText.headline2} />
            </span>
          )}
        </motion.h1>

        <motion.p variants={itemVariants} className="mt-5 text-base leading-7 text-white text-balance max-w-lg mx-auto">
          {heroText.subheadline}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] font-bold px-5 sm:px-7 h-10 sm:h-11 text-xs sm:text-sm shadow-lg shadow-[var(--button-lime)]/10 tracking-wide"
            asChild
          >
            <Link href="/detox">
              {heroText.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/60 text-white hover:bg-black/55 hover:text-white bg-black/40 h-10 sm:h-11 px-4 sm:px-5 text-xs sm:text-sm"
            asChild
          >
            <Link href="/detox">{heroText.ctaSecondary}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

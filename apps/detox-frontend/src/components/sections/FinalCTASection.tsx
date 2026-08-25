"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { BRAND, cn, whatsappLink } from "@urbandetox/utils";
import { Button } from "@urbandetox/ui";

export function FinalCTASection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-brand px-8 py-16 text-center sm:px-16 sm:py-24"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1200&auto=format&fit=crop"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10">
            {/* Editorial line accent */}


            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Need a break, <br></br>but don&apos;t know where to go?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
              Chat with us. We&apos;ll help you find the right offbeat detox without overthinking it.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className={cn(
                  "bg-[var(--button-lime)] text-[var(--button-lime-text)] hover:bg-[var(--button-lime-text)] hover:text-[var(--button-lime)] font-medium px-8 h-12 text-base shadow-lg shadow-[var(--button-lime)]/10"
                )}
                asChild
              >
                <Link href={whatsappLink("Hi, I need help choosing an Urban Detox trip.")} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat on WhatsApp
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent h-12 px-6"
                asChild
              >
                <Link href="/guide">
                  Read Guides <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

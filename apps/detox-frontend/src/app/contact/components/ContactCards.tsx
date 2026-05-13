"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@urbandetox/utils";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Card, CardContent } from "@urbandetox/ui";
import { BRAND } from "@urbandetox/utils";

const cards = [
  { icon: Mail, label: "Email", value: BRAND.contact.email, href: `mailto:${BRAND.contact.email}`, color: "bg-blue-50 text-blue-600" },
  { icon: Phone, label: "Phone", value: BRAND.contact.phone, href: `tel:${BRAND.contact.phone.replace(/-/g, "")}`, color: "bg-emerald-50 text-emerald-600" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat now", href: BRAND.contact.whatsapp, external: true, color: "bg-green-50 text-green-600" },
  { icon: MapPin, label: "Base", value: BRAND.address, color: "bg-amber-50 text-amber-600" },
];

export function ContactCards() {
  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => {
          const content = (
            <Card className={cn("border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl h-full", "hover:shadow-2xl transition-all duration-500 group")}>
              <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                <div className={cn("mb-3 inline-flex items-center justify-center rounded-xl p-3 transition-colors", card.color)}>
                  <card.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{card.label}</span>
                <span className="text-sm font-bold text-foreground group-hover:text-brand transition-colors">{card.value}</span>
              </CardContent>
            </Card>
          );
          return (
            <motion.div key={card.label} variants={itemVariants}>
              {card.href ? (
                card.external ? (
                  <a href={card.href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
                ) : (
                  <Link href={card.href} className="block">{content}</Link>
                )
              ) : (
                <div className="block">{content}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

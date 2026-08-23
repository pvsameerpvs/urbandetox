"use client";

;
import { motion } from "framer-motion";
import { ContactHero } from "./components/ContactHero";
import { ContactCards } from "./components/ContactCards";
import { ContactForm } from "./components/ContactForm";
import { SideInfo } from "./components/SideInfo";
import { CheckCircle2, Headphones, Clock } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <ContactHero />
      <ContactCards />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-brand/60" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Write to Us</span>
              <span className="h-px w-8 bg-brand/60" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">Send a <span className="text-brand">Message</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Fill out the form below and our team will get back to you as soon as possible.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl shadow-black/[0.05] bg-white rounded-2xl">
                <CardContent className="p-6 sm:p-8">
                  <ContactForm />
                </CardContent>
              </Card>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: CheckCircle2, text: "Verified local stays" },
                  { icon: Headphones, text: "24/7 WhatsApp support" },
                  { icon: Clock, text: "Flexible rescheduling" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 rounded-xl bg-secondary/40 px-4 py-3">
                    <item.icon className="h-5 w-5 text-brand shrink-0" />
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <SideInfo />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

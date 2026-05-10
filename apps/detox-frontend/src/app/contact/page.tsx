"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BRAND = {
  email: "hello@urbandetox.in",
  phone: "+91-98765-43210",
  whatsapp: "https://wa.me/919876543210",
  instagram: "https://instagram.com/urbandetox",
  address: "Bangalore, India",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ─── Hero ───────────────────────────────────── */
function ContactHero() {
  return (
    <div className="relative min-h-[60vh] sm:min-h-[55vh] flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000&auto=format&fit=crop"
          alt="Contact Urban Detox"
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
              Get in Touch
            </span>
            <span className="h-px w-8 bg-white/40" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-5">
            Contact <span className="text-white/80">Us</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
            Have a question about a detox, a corporate inquiry, or just want to say hello?
            We read every message.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Contact Info Cards ─────────────────────── */
function ContactCards() {
  const cards = [
    {
      icon: Mail,
      label: "Email",
      value: BRAND.email,
      href: `mailto:${BRAND.email}`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Phone,
      label: "Phone",
      value: BRAND.phone,
      href: `tel:${BRAND.phone.replace(/-/g, "")}`,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat now",
      href: BRAND.whatsapp,
      external: true,
      color: "bg-green-50 text-green-600",
    },
    {
      icon: MapPin,
      label: "Base",
      value: BRAND.address,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Wrapper = card.href ? (card.external ? "a" : Link) : "div";
          const wrapperProps = card.external
            ? { href: card.href, target: "_blank", rel: "noopener noreferrer" }
            : card.href
            ? { href: card.href }
            : {};

          return (
            <motion.div key={card.label} variants={itemVariants}>
              <Wrapper {...(wrapperProps as any)} className="block">
                <Card
                  className={cn(
                    "border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl h-full",
                    "hover:shadow-2xl transition-all duration-500 group"
                  )}
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                    <div
                      className={cn(
                        "mb-3 inline-flex items-center justify-center rounded-xl p-3 transition-colors",
                        card.color
                      )}
                    >
                      <card.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {card.label}
                    </span>
                    <span className="text-sm font-bold text-foreground group-hover:text-brand transition-colors">
                      {card.value}
                    </span>
                  </CardContent>
                </Card>
              </Wrapper>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Contact Form ───────────────────────────── */
function ContactForm() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 sm:py-20 text-center"
      >
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSent(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
          }}
          className="rounded-full h-11 px-6"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-semibold">
          Subject
        </Label>
        <Input
          id="subject"
          placeholder="Booking inquiry / Corporate retreat / General"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Tell us what is on your mind..."
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="rounded-xl bg-secondary/40 border-0 text-sm resize-none focus-visible:ring-2 focus-visible:ring-brand/20"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
        <Button
          type="submit"
          size="lg"
          className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 px-8 text-sm font-semibold shadow-lg shadow-brand/10"
        >
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          We reply within 24 hours
        </span>
      </div>
    </form>
  );
}

/* ─── Trust Badges ───────────────────────────── */
function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { icon: CheckCircle2, text: "Verified local stays" },
        { icon: Headphones, text: "24/7 WhatsApp support" },
        { icon: Clock, text: "Flexible rescheduling" },
      ].map((item) => (
        <div
          key={item.text}
          className="flex items-center gap-3 rounded-xl bg-secondary/40 px-4 py-3"
        >
          <item.icon className="h-5 w-5 text-brand shrink-0" />
          <span className="text-sm font-medium text-foreground">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Side Info Card ─────────────────────────── */
function SideInfo() {
  return (
    <div className="space-y-6">
      {/* Quick Response */}
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-3">
              <Clock className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h3 className="font-bold text-base">Fast Response</h3>
              <p className="text-xs text-muted-foreground">Average reply time</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-bold text-brand">&lt; 4</span>
            <span className="text-sm font-medium text-muted-foreground">hours</span>
          </div>
          <p className="text-sm text-muted-foreground">
            We prioritize booking inquiries and urgent questions. Expect a reply before your next meal.
          </p>
        </CardContent>
      </Card>

      {/* Instagram */}
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-pink-50 p-3">
              <Instagram className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-bold text-base">Follow Us</h3>
              <p className="text-xs text-muted-foreground">@urbandetox</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            See real photos from our trips, traveler stories, and upcoming detox announcements.
          </p>
          <Button
            variant="outline"
            className="w-full rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50 h-11"
            asChild
          >
            <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram className="mr-2 h-4 w-4" /> Follow on Instagram
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* WhatsApp CTA */}
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-brand rounded-2xl overflow-hidden">
        <CardContent className="p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-white/15 p-3">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Prefer WhatsApp?</h3>
              <p className="text-xs text-white/60">Quick questions welcome</p>
            </div>
          </div>
          <p className="text-sm text-white/70 mb-4">
            Most of our travelers book via WhatsApp. Drop us a message and we will guide you through the process.
          </p>
          <Button
            className="w-full rounded-xl bg-white text-brand hover:bg-white/90 h-11 font-semibold"
            asChild
          >
            <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────── */
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactHero />
      <ContactCards />

      {/* Form + Info */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-brand/60" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Write to Us
              </span>
              <span className="h-px w-8 bg-brand/60" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              Send a <span className="text-brand">Message</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl shadow-black/[0.05] bg-white rounded-2xl">
                <CardContent className="p-6 sm:p-8">
                  <ContactForm />
                </CardContent>
              </Card>

              {/* Trust badges below form */}
              <div className="mt-6">
                <TrustBadges />
              </div>
            </div>

            {/* Side info */}
            <div className="lg:col-span-1">
              <SideInfo />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Send, Loader2 } from "lucide-react";
import { Button, Input, Label, Textarea } from "@urbandetox/ui"
import { submitContact } from "@/lib/api";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await submitContact(formData);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
        <p className="text-muted-foreground max-w-sm mb-6">Thank you for reaching out. We will get back to you within 24 hours.</p>
        <Button variant="outline" onClick={() => { setSent(false); setError(null); setFormData({ name: "", email: "", subject: "", message: "" }); }} className="rounded-full h-11 px-6">
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
          <Input id="name" placeholder="Your name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-semibold">Subject</Label>
        <Input id="subject" placeholder="Booking inquiry / Corporate retreat / General" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
        <Textarea id="message" placeholder="Tell us what is on your mind..." rows={5} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="rounded-xl bg-secondary/40 border-0 text-sm resize-none focus-visible:ring-2 focus-visible:ring-brand/20" />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
        <Button type="submit" size="lg" disabled={sending} className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 px-8 text-sm font-semibold shadow-lg shadow-brand/10">
          {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          {sending ? "Sending..." : "Send Message"}
        </Button>
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> We reply within 24 hours
        </span>
      </div>
    </form>
  );
}

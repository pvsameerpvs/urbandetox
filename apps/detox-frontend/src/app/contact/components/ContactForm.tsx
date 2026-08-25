"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Send, Loader2 } from "lucide-react";
import { Button, Input, Label, Textarea } from "@urbandetox/ui"
import { submitContact } from "@/lib/api";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact-schema";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sendingRef = useRef(false);

  const form = useForm<ContactFormValues>({
    resolver: standardSchemaResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  /**
   * The in-flight guard used to be released only on the error path, so after
   * one successful send sendingRef stayed true forever. "Send Another Message"
   * cleared the form but not the ref, so the next submit returned at the guard:
   * no request, no error, no spinner, and the enquiry was silently dropped for
   * the rest of the session. Released in a finally instead.
   */
  const handleSubmit = async (data: ContactFormValues) => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setError(null);
    try {
      await submitContact(data);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      sendingRef.current = false;
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
        <Button variant="outline" onClick={() => { setSent(false); setError(null); sendingRef.current = false; form.reset(); }} className="rounded-full h-11 px-6">
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  const { formState: { errors, isSubmitting }, register, handleSubmit: rhfHandleSubmit } = form;

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void rhfHandleSubmit(handleSubmit)(e);
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
          <Input id="name" placeholder="Your name" {...register("name")} className={`h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 ${errors.name ? "ring-2 ring-red-400" : ""}`} />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className={`h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 ${errors.email ? "ring-2 ring-red-400" : ""}`} />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-semibold">Subject</Label>
        <Input id="subject" placeholder="Booking inquiry / Corporate retreat / General" {...register("subject")} className={`h-12 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20 ${errors.subject ? "ring-2 ring-red-400" : ""}`} />
        {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
        <Textarea id="message" placeholder="Tell us what is on your mind..." rows={5} {...register("message")} className={`rounded-xl bg-secondary/40 border-0 text-sm resize-none focus-visible:ring-2 focus-visible:ring-brand/20 ${errors.message ? "ring-2 ring-red-400" : ""}`} />
        {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
        <Button type="submit" size="lg" disabled={isSubmitting} className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 px-8 text-sm font-semibold shadow-lg shadow-brand/10">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> We reply within 24 hours
        </span>
      </div>
    </form>
  );
}

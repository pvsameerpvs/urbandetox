"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">Contact</h1>
          <p className="text-muted-foreground">
            Have a question about a detox, a corporate inquiry, or just want to say hello? We read every message.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-6 sm:p-8">
                {sent ? (
                  <div className="py-12 text-center">
                    <h3 className="text-xl font-semibold mb-2">Message sent</h3>
                    <p className="text-muted-foreground">We will get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Booking inquiry / Corporate retreat / General" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Tell us what is on your mind..." rows={5} required />
                    </div>
                    <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-border/60 bg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-5 w-5 text-brand" />
                  <p className="text-sm font-medium">Email</p>
                </div>
                <p className="text-sm text-muted-foreground">hello@urbandetox.in</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-5 w-5 text-brand" />
                  <p className="text-sm font-medium">Phone / WhatsApp</p>
                </div>
                <p className="text-sm text-muted-foreground">+91-98765-43210</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="h-5 w-5 text-brand" />
                  <p className="text-sm font-medium">Base</p>
                </div>
                <p className="text-sm text-muted-foreground">Bangalore, India</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Instagram, MessageCircle } from "lucide-react";

const BRAND = {
  whatsapp: "https://wa.me/919876543210",
  instagram: "https://instagram.com/urbandetox",
};

export function SideInfo() {
  return (
    <div className="space-y-6">
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
          <p className="text-sm text-muted-foreground">We prioritize booking inquiries and urgent questions. Expect a reply before your next meal.</p>
        </CardContent>
      </Card>

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
          <p className="text-sm text-muted-foreground mb-4">See real photos from our trips, traveler stories, and upcoming detox announcements.</p>
          <Button variant="outline" className="w-full rounded-xl border-pink-200 text-pink-600 hover:bg-pink-50 h-11" asChild>
            <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="mr-2 h-4 w-4" /> Follow on Instagram</a>
          </Button>
        </CardContent>
      </Card>

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
          <p className="text-sm text-white/70 mb-4">Most of our travelers book via WhatsApp. Drop us a message and we will guide you through the process.</p>
          <Button className="w-full rounded-xl bg-white text-brand hover:bg-white/90 h-11 font-semibold" asChild>
            <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
;
;
;
import { Check, Building2, ArrowRight } from "lucide-react";
import { Button, Card, CardContent, Separator } from "@urbandetox/ui"

import type { Metadata } from "next";
import { clamp, routeSeo } from "@/lib/metadata";

/** Without this the route inherited the root title and had no canonical. */
export const metadata: Metadata = {
  title: "Corporate Retreats",
  description: clamp("Private offsites and team retreats in South India, booked as a whole group and arranged end to end."),
  ...routeSeo({ path: "/corporate-retreats" }),
};

const inclusions = [
  "Custom itinerary design",
  "Dedicated trip lead",
  "Local stay booking",
  "Team reflection sessions",
  "Meal planning",
  "Travel assistance",
  "Safety protocols",
  "Post-trip summary",
];

export default function CorporateRetreatsPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 inline-flex items-center justify-center rounded-lg bg-brand-muted p-3">
          <Building2 className="h-6 w-6 text-brand" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">Corporate Retreats</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Take your team off the grid. Our corporate detox retreats are designed for deeper bonding, creative thinking, and genuine rest — without the generic hotel banquet hall vibe.
        </p>

        {/* These sizes are larger than the 10-traveller cap on purpose: a
            corporate booking is a private charter for one company, not a
            public departure that strangers join. Saying so removes what would
            otherwise read as a contradiction. */}
        <p className="mb-6 text-sm text-muted-foreground">
          Corporate trips are private charters booked as a whole group, so they
          are not held to the 10-traveller cap that applies to our public
          departures.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-10">
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold mb-2">Small teams (8 to 15)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Perfect for leadership offsites, product sprints, or team resets. We use our standard detox framework with added team exercises.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold mb-2">Larger teams (20 to 40)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We book multiple adjacent properties and run parallel tracks. Some groups hike, some reflect, everyone meets at the bonfire.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <h2 className="text-xl font-semibold mb-4">What We Handle</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-10">
          {inclusions.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-brand shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-brand p-6 text-center sm:p-8">
          <h3 className="text-xl font-semibold text-white mb-2">Plan your team reset</h3>
          <p className="text-white/80 mb-4">Share your team size, preferred destination, and goals. We will design a proposal.</p>
          <Button className="bg-white text-brand hover:bg-white/90" asChild>
            <Link href="/contact">Request a Proposal <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

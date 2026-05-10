import { Card, CardContent } from "@/components/ui/card";
import { Compass, Users, ShieldCheck, Sparkles } from "lucide-react";

const reasons = [
  {
    icon: Compass,
    title: "Offbeat curated escapes",
    description:
      "We skip the tourist traps. Every destination is chosen for quiet, beauty, and real disconnection.",
  },
  {
    icon: Users,
    title: "Small-group energy",
    description:
      "Groups of 6 to 12 people. Intimate enough to make friends, small enough to stay personal.",
  },
  {
    icon: ShieldCheck,
    title: "No planning stress",
    description:
      "We handle stays, local transport, meals, and activities. You just show up and breathe.",
  },
  {
    icon: Sparkles,
    title: "Real reset from routine",
    description:
      "Guided silence, nature walks, and intentional downtime. Not a tour. A reset.",
  },
];

export function WhySection() {
  return (
    <section className="py-16 sm:py-20 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Why Urban Detox</h2>
          <p className="mt-2 text-muted-foreground">
            Built for people who are tired of crowded itineraries and generic getaways.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <Card key={r.title} className="border-border/60 bg-card">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-brand-muted p-3">
                  <r.icon className="h-5 w-5 text-brand" />
                </div>
                <h3 className="text-base font-semibold mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

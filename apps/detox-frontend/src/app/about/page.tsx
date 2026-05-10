import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Leaf, MapPin, Users, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">About Urban Detox</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          Urban Detox was born from a simple observation: people are exhausted by their own routines.
          We design short, offbeat escapes that help you disconnect from noise and reconnect with nature, stillness, and yourself.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-10">
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-brand-muted p-3">
                <MapPin className="h-5 w-5 text-brand" />
              </div>
              <h3 className="text-base font-semibold mb-2">Offbeat First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We skip tourist traps. Every destination is chosen for quiet, beauty, and real disconnection.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-brand-muted p-3">
                <Users className="h-5 w-5 text-brand" />
              </div>
              <h3 className="text-base font-semibold mb-2">Small Groups</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                6 to 12 people. Intimate enough to make friends, small enough to stay personal.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-brand-muted p-3">
                <Heart className="h-5 w-5 text-brand" />
              </div>
              <h3 className="text-base font-semibold mb-2">Local Stays</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Family-run cottages and homestays. Clean, safe, and authentic. Not luxury, but real.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-brand-muted p-3">
                <Leaf className="h-5 w-5 text-brand" />
              </div>
              <h3 className="text-base font-semibold mb-2">Guided Stillness</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nature walks, silence sessions, and intentional downtime. Not a tour. A reset.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <h2 className="text-2xl font-semibold tracking-tight mb-4">How It Started</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Urban Detox began in 2023 as a series of informal weekend trips from Bangalore to Kodaikanal.
          A small group of friends realized that two days in the forest, with no agenda and no signal, changed their entire month.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Word spread. More people wanted in. So we designed a system: curated destinations, local stays, small groups, and a clear intention — to help urban professionals reset without needing a 10-day vacation.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Today, Urban Detox operates across the Western Ghats, North Kerala, and the Karnataka coast.
          We remain small, intentional, and committed to the original idea: real reset, real places, real people.
        </p>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, GraduationCap, ArrowRight } from "lucide-react";

const features = [
  "Faculty oversight integration",
  "Curriculum-linked modules",
  "Student safety protocols",
  "Group accommodation booking",
  "Local expert sessions",
  "Guided field activities",
  "Travel insurance assistance",
  "Pre-trip orientation deck",
];

export default function UniversityTripsPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 inline-flex items-center justify-center rounded-lg bg-brand-muted p-3">
          <GraduationCap className="h-6 w-6 text-brand" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">University Trips</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Educational journeys that balance learning with lived experience. We design trips for universities that want their students to learn outside the classroom — safely, intentionally, and memorably.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-10">
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold mb-2">Experiential Learning</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ecology, sociology, anthropology, and design students benefit from real-world observation in offbeat destinations.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold mb-2">Safety First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every trip has a faculty liaison, local guide, first-aid support, and 24/7 coordination from our Bangalore base.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <h2 className="text-xl font-semibold mb-4">What We Provide</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-10">
          {features.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-brand shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-brand p-6 text-center sm:p-8">
          <h3 className="text-xl font-semibold text-white mb-2">Plan a university trip</h3>
          <p className="text-white/80 mb-4">Share your department, batch size, and learning goals. We will design a trip proposal.</p>
          <Button className="bg-white text-brand hover:bg-white/90" asChild>
            <Link href="/contact">Request a Proposal <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

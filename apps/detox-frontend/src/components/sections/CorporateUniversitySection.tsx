import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";

export function CorporateUniversitySection() {
  return (
    <section className="py-16 sm:py-20 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border-border/60 bg-card">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-brand-muted p-3">
                <Building2 className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Corporate Retreats</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Take your team off the grid. Custom detox-style retreats designed for deeper bonding, creative thinking, and genuine rest. We handle logistics, you bring the people.
              </p>
              <Button variant="outline" asChild>
                <Link href="/corporate-retreats">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-brand-muted p-3">
                <GraduationCap className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-2">University Trips</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Educational journeys that balance learning with lived experience. Faculty-led modules, safety protocols, and destinations that teach without classrooms.
              </p>
              <Button variant="outline" asChild>
                <Link href="/university-trips">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

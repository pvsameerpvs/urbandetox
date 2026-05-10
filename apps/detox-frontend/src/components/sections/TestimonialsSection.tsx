import { Card, CardContent } from "@/components/ui/card";
import { fetchTestimonials } from "@/lib/data";
import { Star, MapPin } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = fetchTestimonials(4);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Memories</h2>
          <p className="mt-2 text-muted-foreground">
            Real travelers. Real resets. No filters needed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <Card key={t.id} className="border-border/60 bg-card h-full">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  “{t.quote}”
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{t.tripDate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

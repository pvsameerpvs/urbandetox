import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";


interface PriceLine {
  label: string;
  value: string;
  isTotal?: boolean;
}

interface BookingSummaryCardProps {
  image: string;
  title: string;
  destination: string;
  durationLabel: string;
  dates: string;
  meetingPoint: string;
  travelers: number;
  seatsLeft: number;
  priceLines: PriceLine[];
  total: number;
  showPaymentConfirmed?: boolean;
}

export function BookingSummaryCard({
  image,
  title,
  destination,
  durationLabel,
  dates,
  meetingPoint,
  travelers,
  seatsLeft,
  priceLines,
  showPaymentConfirmed,
}: BookingSummaryCardProps) {
  return (
    <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl overflow-hidden">
      <div className="relative h-36">
        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-white/80 text-xs">{destination} · {durationLabel}</p>
        </div>
      </div>
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-4 w-4 text-brand shrink-0" />
            <span>{dates}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="h-4 w-4 text-brand shrink-0" />
            <span>{meetingPoint}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="h-4 w-4 text-brand shrink-0" />
            <span>{durationLabel}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Users className="h-4 w-4 text-brand shrink-0" />
            <span>{travelers} traveler{travelers > 1 ? "s" : ""} · {seatsLeft} seats left</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          {priceLines.map((line) => (
            <div key={line.label} className="flex items-center justify-between text-sm">
              <span className={line.isTotal ? "font-bold text-base" : "text-muted-foreground"}>
                {line.label}
              </span>
              <span className={line.isTotal ? "text-2xl font-bold text-brand" : "font-medium"}>
                {line.value}
              </span>
            </div>
          ))}
        </div>

        {showPaymentConfirmed && (
          <div className="rounded-xl bg-brand/5 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <Check className="h-3 w-3 text-brand inline mr-1" />
              Payment confirmed. Complete onboarding to secure your spot.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

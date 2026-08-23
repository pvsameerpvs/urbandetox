import Image from "next/image";
import { MapPin, Users, MessageCircle } from "lucide-react";

const FACTS = [
  { icon: MapPin, text: "Any location, not only where we run trips" },
  { icon: Users, text: "Solo travellers, families and groups" },
  { icon: MessageCircle, text: "We reply on WhatsApp or email" },
];

export function LocalGuidesHero() {
  return (
    <div className="relative">
      <div className="relative h-[42vh] min-h-[300px] max-h-[460px] overflow-hidden">
        <Image
          src="https://pub-f5b50eb029e5430db1a9767ba1ee3421.r2.dev/packages/gallery/north-kerala-detox/north-kerala-detox-25.jpg"
          alt="A trip lead walking with travellers in North Kerala"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Text sits across the middle of this band, so the scrim has to cover
            more than the bottom edge. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/45" />

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-on-media">
              Local guides
            </p>
            <h1 className="mb-4 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Hire a local guide, anywhere you are going
            </h1>
            <p className="max-w-xl text-base text-white/90">
              Tell us the place and the dates. We will find someone who actually
              lives there and knows it properly, and put you in touch.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FACTS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-3 rounded-2xl border-0 bg-white p-4 shadow-lg shadow-black/[0.04]"
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                <Icon className="h-4 w-4 text-brand" />
              </span>
              <p className="text-xs font-medium leading-snug text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

;
import { Calendar, Users, MapPin, MessageCircle, Download } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui"

interface NextStep {
  icon: typeof Calendar;
  title: string;
  description: string;
}

const defaultSteps: NextStep[] = [
  {
    icon: MessageCircle,
    title: "WhatsApp Group",
    description: "You will be added 3 days before departure for group coordination.",
  },
  {
    icon: Download,
    title: "Packing Checklist",
    description: "Check the guide section for a complete packing list for your destination.",
  },
  {
    icon: MapPin,
    title: "Meeting Point",
    description: "Reach the meeting point on time. Details are in your confirmation email.",
  },
  {
    icon: Users,
    title: "Travel Buddy",
    description: "Connect with fellow travelers in the WhatsApp group before the trip.",
  },
];

export function NextStepsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {defaultSteps.map((step) => (
        <Card
          key={step.title}
          className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl hover:shadow-md transition-all duration-300"
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5 shrink-0">
                <step.icon className="h-5 w-5 text-brand" />
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

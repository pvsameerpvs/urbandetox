"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck, Loader2 } from "lucide-react";
import { Badge, Button, Card, CardContent } from "@urbandetox/ui";

type DetailsState = "loading" | "pending" | "complete";

interface TravellerDetailsCardProps {
  departureCode: string;
  state: DetailsState;
  /** Step to resume at when details were partially filled. */
  resumeStep?: number;
}

export function TravellerDetailsCard({
  departureCode,
  state,
  resumeStep,
}: TravellerDetailsCardProps) {
  if (state === "loading") {
    return (
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-secondary/30 rounded-2xl mb-8">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking your traveller details...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state === "complete") {
    return (
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-emerald-50 rounded-2xl mb-8">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-emerald-100 p-2.5 shrink-0">
              <FileCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-sm font-bold">All Set for Your Trip</h3>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] font-medium">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Details Received
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We have your traveler details, health info, emergency contacts, and travel
                preferences. You can view or edit them anytime in My Detox.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const href = resumeStep
    ? `/book/${departureCode}/onboarding?step=${resumeStep}`
    : `/book/${departureCode}/onboarding`;

  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-brand-muted rounded-2xl mb-8">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="inline-flex items-center justify-center rounded-xl bg-white/70 p-2.5 shrink-0">
              <FileCheck className="h-5 w-5 text-brand" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold mb-1">
                {resumeStep ? "Finish your traveller details" : "Add your traveller details"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your seat is confirmed. Share who is travelling, food preferences and an
                emergency contact so we can arrange your stay and pickup. You can do this
                whenever suits you, and we have emailed you the link too.
              </p>
            </div>
          </div>
          <Button
            className="w-full sm:w-auto shrink-0 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-5 text-sm font-semibold"
            asChild
          >
            <Link href={href}>
              {resumeStep ? "Continue" : "Add Details"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

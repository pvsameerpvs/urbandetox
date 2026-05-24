import { Card, CardContent } from "@urbandetox/ui";
import { Route } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="border border-border/40 rounded-2xl bg-white">
      <CardContent className="p-12 text-center">
        <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
          <Route className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-bold">No departures yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Add trip dates so customers can book. Each departure links to a package and destination.
        </p>
      </CardContent>
    </Card>
  );
}

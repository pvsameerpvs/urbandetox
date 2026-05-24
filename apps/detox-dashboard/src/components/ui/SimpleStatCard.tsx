import { Card, CardContent } from "@urbandetox/ui";
import { cn } from "@urbandetox/utils";

interface SimpleStatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  bgClass: string;
}

export function SimpleStatCard({ value, label, icon, bgClass }: SimpleStatCardProps) {
  return (
    <Card className="border border-border/40 bg-white rounded-2xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", bgClass)}>
          {icon}
        </div>
        <div>
          <p className="text-xl font-bold leading-none">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

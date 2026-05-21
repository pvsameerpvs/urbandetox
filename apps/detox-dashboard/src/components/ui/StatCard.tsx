"use client";

import { Card, CardContent } from "@urbandetox/ui";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {change}
            </p>
          </div>
          <div className="rounded-xl bg-brand/10 p-2.5">
            <Icon className="h-5 w-5 text-brand" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

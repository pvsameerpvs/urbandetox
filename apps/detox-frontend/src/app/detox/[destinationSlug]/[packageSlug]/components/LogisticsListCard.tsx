"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui";

interface LogisticsListCardProps {
  icon: LucideIcon;
  title: string;
  items: string[];
}

export function LogisticsListCard({ icon: Icon, title, items }: LogisticsListCardProps) {
  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
      <CardContent className="p-5 sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
          <span className="inline-flex items-center justify-center rounded-lg bg-brand/10 p-1.5">
            <Icon className="h-4 w-4 text-brand" />
          </span>
          {title}
        </h3>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

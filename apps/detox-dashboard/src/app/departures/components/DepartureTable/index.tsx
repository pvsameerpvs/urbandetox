"use client";

import { Card } from "@urbandetox/ui";
import type { Departure, Package, Destination } from "@urbandetox/utils";
import { EmptyState } from "./EmptyState";
import { DepartureRow } from "./DepartureRow";

interface DepartureTableProps {
  departures: Departure[];
  packages: Package[];
  destinations: Destination[];
  onDeleteClick: (id: string) => void;
}

export function DepartureTable({ departures, packages, destinations, onDeleteClick }: DepartureTableProps) {
  if (departures.length === 0) {
    return <EmptyState />;
  }

  return (
    <Card className="border border-border/40 rounded-2xl bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-secondary/[0.03]">
              <TableHeader>Departure</TableHeader>
              <TableHeader>Trip</TableHeader>
              <TableHeader>Dates</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Seats</TableHeader>
              <TableHeader>Booking</TableHeader>
              <TableHeader>
                <span className="flex items-center gap-1">
                  Outcome
                  <span className="text-[9px] normal-case bg-muted px-1 rounded text-muted-foreground">
                    internal
                  </span>
                </span>
              </TableHeader>
              <TableHeader align="right">Action</TableHeader>
            </tr>
          </thead>
          <tbody>
            {departures.map((dep) => (
              <DepartureRow
                key={dep.id}
                dep={dep}
                packages={packages}
                destinations={destinations}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`
        px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground
        ${align === "right" ? "text-right" : "text-left"}
      `}
    >
      {children}
    </th>
  );
}

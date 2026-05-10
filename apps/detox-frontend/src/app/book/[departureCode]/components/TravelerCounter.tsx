"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Users } from "lucide-react";
import { formatPrice } from "@/lib/formatters";

interface TravelerCounterProps {
  count: number;
  maxSeats: number;
  pricePerPerson: number;
  onChange: (count: number) => void;
}

export function TravelerCounter({ count, maxSeats, pricePerPerson, onChange }: TravelerCounterProps) {
  const total = count * pricePerPerson;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2 shrink-0">
          <Users className="h-4 w-4 text-brand" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Number of Travelers</h3>
          <p className="text-xs text-muted-foreground">{formatPrice(pricePerPerson)} per person · Max {maxSeats} seats</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, count - 1))}
          disabled={count <= 1}
          className="inline-flex items-center justify-center h-12 w-12 rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="h-4 w-4" />
        </button>
        <Input
          type="number"
          min={1}
          max={maxSeats}
          value={count}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= 1 && val <= maxSeats) onChange(val);
          }}
          className="h-12 text-center w-20 sm:w-24 rounded-xl bg-secondary/40 border-0 text-sm font-bold focus-visible:ring-2 focus-visible:ring-brand/20"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(maxSeats, count + 1))}
          disabled={count >= maxSeats}
          className="inline-flex items-center justify-center h-12 w-12 rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div className="ml-auto text-right">
          <p className="text-xs text-muted-foreground">Subtotal</p>
          <p className="text-lg font-bold text-brand">{formatPrice(total)}</p>
        </div>
      </div>
    </div>
  );
}

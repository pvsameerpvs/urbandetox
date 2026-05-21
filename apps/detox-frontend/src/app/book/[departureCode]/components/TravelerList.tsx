"use client";

import { useState } from "react";
import type { Traveler } from "@urbandetox/utils";
import { TravelerCard } from "./TravelerCard";

interface TravelerListProps {
  travelers: Traveler[];
  onUpdate: (travelers: Traveler[]) => void;
}

export function TravelerList({ travelers, onUpdate }: TravelerListProps) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const updateTraveler = (index: number, data: Partial<Traveler>) => {
    onUpdate(travelers.map((t, i) => (i === index ? { ...t, ...data } : t)));
  };

  return (
    <div className="space-y-4">
      {travelers.map((traveler, index) => (
        <TravelerCard
          key={traveler.id}
          traveler={traveler}
          index={index}
          isExpanded={expandedIndex === index}
          onToggle={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
          onUpdate={(data) => updateTraveler(index, data)}
        />
      ))}
    </div>
  );
}

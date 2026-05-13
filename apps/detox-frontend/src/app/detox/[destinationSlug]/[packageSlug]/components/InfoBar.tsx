"use client";

import { motion } from "framer-motion";
;
import { Clock, Users, Leaf, MapPin } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui"

interface InfoBarProps {
  durationLabel: string;
  groupSize: string;
  style: string;
  meetingPoint: string;
}

export function InfoBar({ durationLabel, groupSize, style, meetingPoint }: InfoBarProps) {
  const items = [
    { icon: Clock, label: "Duration", value: durationLabel },
    { icon: Users, label: "Group", value: groupSize },
    { icon: Leaf, label: "Style", value: style },
    { icon: MapPin, label: "Meeting", value: meetingPoint },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
                    <item.icon className="h-4 w-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

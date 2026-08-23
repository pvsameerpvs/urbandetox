"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@urbandetox/utils";
import {
  Sun,
  CloudRain,
  Waves,
  Mountain,
  Snowflake,
  Moon,
  CloudSun,
  CloudLightning,
  Wind,
  Umbrella,
  TreePine,
  Flame,
  Leaf,
  Flower2,
  Heart,
  Star,
  Sparkles,
  Compass,
  MapPin,
  Tent,
  Anchor,
  Plane,
  Car,
  Bike,
  Camera,
  Music,
  Coffee,
  Sunrise,
  Sunset,
  ThermometerSun,
  Droplets,
  Bird,
  TreeDeciduous,
  CloudFog,
  PartyPopper,
  Gem,
  Crown,
  Award,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CURATED_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "Sun", icon: Sun },
  { name: "CloudRain", icon: CloudRain },
  { name: "Waves", icon: Waves },
  { name: "Mountain", icon: Mountain },
  { name: "Snowflake", icon: Snowflake },
  { name: "Moon", icon: Moon },
  { name: "CloudSun", icon: CloudSun },
  { name: "CloudLightning", icon: CloudLightning },
  { name: "Wind", icon: Wind },
  { name: "Umbrella", icon: Umbrella },
  { name: "TreePine", icon: TreePine },
  { name: "Flame", icon: Flame },
  { name: "Leaf", icon: Leaf },
  { name: "Flower2", icon: Flower2 },
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Sparkles", icon: Sparkles },
  { name: "Compass", icon: Compass },
  { name: "MapPin", icon: MapPin },
  { name: "Tent", icon: Tent },
  { name: "Anchor", icon: Anchor },
  { name: "Plane", icon: Plane },
  { name: "Car", icon: Car },
  { name: "Bike", icon: Bike },
  { name: "Camera", icon: Camera },
  { name: "Music", icon: Music },
  { name: "Coffee", icon: Coffee },
  { name: "Sunrise", icon: Sunrise },
  { name: "Sunset", icon: Sunset },
  { name: "ThermometerSun", icon: ThermometerSun },
  { name: "Droplets", icon: Droplets },
  { name: "Bird", icon: Bird },
  { name: "TreeDeciduous", icon: TreeDeciduous },
  { name: "CloudFog", icon: CloudFog },
  { name: "PartyPopper", icon: PartyPopper },
  { name: "Gem", icon: Gem },
  { name: "Crown", icon: Crown },
  { name: "Award", icon: Award },
  { name: "Zap", icon: Zap },
];

const ICON_MAP = Object.fromEntries(CURATED_ICONS.map((i) => [i.name, i.icon]));

export function getLucideIcon(name: string): LucideIcon {
  return ICON_MAP[name] || Sun;
}

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
  label?: string;
  error?: string;
}

export function IconPicker({ value, onChange, label = "Icon", error }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState<{ left: number; top: number; width: number }>({ left: 0, top: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /** The dropdown renders through a portal, so it is not inside `ref`. */
  const panelRef = useRef<HTMLDivElement>(null);

  const selected = CURATED_ICONS.find((i) => i.name === value);
  const SelectedIcon = selected?.icon || Sun;

  const filtered = CURATED_ICONS.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      // The panel is portalled to document.body, so ref.contains(target) is
      // false for every icon in the list. Without checking panelRef the
      // mousedown closed the picker before the click could select anything.
      const insideTrigger = ref.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      if (!insideTrigger && !insidePanel) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        left: rect.left,
        top: rect.bottom + 6,
        width: rect.width,
      });
    }
  }, [open]);

  const dropdown = (
    <div
      ref={panelRef}
      className="fixed z-[100] bg-white rounded-xl border border-border shadow-xl shadow-black/10 overflow-hidden"
      style={{ left: pos.left, top: pos.top, width: pos.width }}
    >
      <div className="p-2 border-b border-border/40">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-secondary/50 rounded-lg">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="max-h-[240px] overflow-y-auto p-2">
        <div className="grid grid-cols-6 gap-1">
          {filtered.map((item) => {
            const Icon = item.icon;
            const isSelected = item.name === value;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onChange(item.name);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] transition-colors",
                  isSelected
                    ? "bg-brand/10 text-brand ring-1 ring-brand/30"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
                title={item.name}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate w-full text-center">{item.name}</span>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No icons found</p>
        )}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="relative">
      {label && <label className="text-sm font-medium mb-1.5 block">{label}</label>}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between w-full h-11 px-3 rounded-xl border text-sm transition-colors",
          open ? "border-brand ring-2 ring-brand/10" : "border-input hover:border-brand/50",
          error && "border-red-500"
        )}
      >
        <div className="flex items-center gap-2.5">
          <SelectedIcon className="h-4 w-4 text-brand" />
          <span className="text-foreground">{selected?.name || value || "Select an icon"}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {open && typeof document !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}

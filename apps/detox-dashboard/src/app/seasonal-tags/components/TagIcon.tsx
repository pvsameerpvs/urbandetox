"use client";

import type { LucideIcon } from "lucide-react";
import {
  Sun, CloudRain, Waves, Mountain, Snowflake, Moon, CloudSun,
  CloudLightning, Wind, Umbrella, TreePine, Flame, Leaf, Flower2,
  Heart, Star, Sparkles, Compass, MapPin, Tent, Anchor, Plane,
  Car, Bike, Camera, Music, Coffee, Sunrise, Sunset, ThermometerSun,
  Droplets, Bird, TreeDeciduous, CloudFog, PartyPopper, Gem, Crown,
  Award, Zap,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Sun, CloudRain, Waves, Mountain, Snowflake, Moon, CloudSun,
  CloudLightning, Wind, Umbrella, TreePine, Flame, Leaf, Flower2,
  Heart, Star, Sparkles, Compass, MapPin, Tent, Anchor, Plane,
  Car, Bike, Camera, Music, Coffee, Sunrise, Sunset, ThermometerSun,
  Droplets, Bird, TreeDeciduous, CloudFog, PartyPopper, Gem, Crown,
  Award, Zap,
};

interface TagIconProps {
  name: string;
}

export function TagIcon({ name }: TagIconProps) {
  const Icon = ICONS[name] || Sun;
  return <Icon className="h-6 w-6 text-brand" />;
}

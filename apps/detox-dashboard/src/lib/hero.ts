"use client";

const STORAGE_KEY = "urbandetox-hero-images";
const ACTIVE_KEY = "urbandetox-hero-active";
const TEXT_KEY = "urbandetox-hero-text";
const DEFAULT_HERO = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop";

export interface HeroText {
  badge: string;
  headline1: string;
  headline2: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export const DEFAULT_TEXT: HeroText = {
  badge: "Curated Offbeat Escapes",
  headline1: "Disconnect from routine.",
  headline2: "Step into your next detox.",
  subheadline: "Small-group escapes to the Western Ghats, Kerala, and beyond. Local stays, guided stillness, and real reset.",
  ctaPrimary: "Explore Detox",
  ctaSecondary: "View Upcoming",
};

export function getHeroImages(): string[] {
  if (typeof window === "undefined") return [DEFAULT_HERO, "", "", "", ""];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [DEFAULT_HERO, "", "", "", ""];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) && parsed.length === 5 ? parsed : [DEFAULT_HERO, "", "", "", ""];
  } catch {
    return [DEFAULT_HERO, "", "", "", ""];
  }
}

export function setHeroImages(images: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images.slice(0, 5)));
}

export function getActiveHeroIndex(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    const idx = raw ? parseInt(raw, 10) : 0;
    return isNaN(idx) || idx < 0 || idx > 4 ? 0 : idx;
  } catch {
    return 0;
  }
}

export function setActiveHeroIndex(index: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_KEY, String(index));
}

export function getHeroImage(): string {
  const images = getHeroImages();
  const active = getActiveHeroIndex();
  const img = images[active];
  return img && (img.startsWith("http") || img.startsWith("data:image")) ? img : DEFAULT_HERO;
}

export function getHeroText(): HeroText {
  if (typeof window === "undefined") return DEFAULT_TEXT;
  try {
    const raw = localStorage.getItem(TEXT_KEY);
    if (!raw) return DEFAULT_TEXT;
    const parsed = JSON.parse(raw) as HeroText;
    return { ...DEFAULT_TEXT, ...parsed };
  } catch {
    return DEFAULT_TEXT;
  }
}

export function setHeroText(text: Partial<HeroText>) {
  if (typeof window === "undefined") return;
  const current = getHeroText();
  localStorage.setItem(TEXT_KEY, JSON.stringify({ ...current, ...text }));
}

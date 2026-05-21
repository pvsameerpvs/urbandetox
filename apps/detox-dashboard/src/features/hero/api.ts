import {
  getHeroImages,
  setHeroImages,
  getActiveHeroIndex,
  setActiveHeroIndex,
  getHeroText,
  setHeroText,
  DEFAULT_TEXT,
  type HeroText,
} from "@/lib/hero";

export const heroApi = {
  getImages: getHeroImages,
  setImages: setHeroImages,
  getActiveIndex: getActiveHeroIndex,
  setActiveIndex: setActiveHeroIndex,
  getText: getHeroText,
  setText: setHeroText,
  defaultText: DEFAULT_TEXT,
} as const;

export type { HeroText };

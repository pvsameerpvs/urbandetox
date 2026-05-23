export interface SocialLink {
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "snapchat" | "youtube";
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  footerEnabled: boolean;
  socialLinks: SocialLink[];
  whatsappNumber: string;
  heroImages: string[];
  activeHeroIndex: number;
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubheadline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
}

export const defaultSocialLinks: SocialLink[] = [
  { platform: "facebook", url: "", enabled: false },
  { platform: "instagram", url: "https://instagram.com/urbandetox", enabled: true },
  { platform: "twitter", url: "", enabled: false },
  { platform: "linkedin", url: "", enabled: false },
  { platform: "snapchat", url: "", enabled: false },
  { platform: "youtube", url: "", enabled: false },
];

const DEFAULT_HERO = "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop";

export const defaultSiteSettings: SiteSettings = {
  footerEnabled: true,
  socialLinks: defaultSocialLinks,
  whatsappNumber: "919876543210",
  heroImages: [DEFAULT_HERO, "", "", "", ""],
  activeHeroIndex: 0,
  heroBadge: "Curated Offbeat Escapes",
  heroHeadline1: "Disconnect from routine.",
  heroHeadline2: "Step into your next detox.",
  heroSubheadline: "Small-group escapes to the Western Ghats, Kerala, and beyond. Local stays, guided stillness, and real reset.",
  heroCtaPrimary: "Explore Detox",
  heroCtaSecondary: "View Upcoming",
};

export const socialPlatformLabels: Record<SocialLink["platform"], string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  snapchat: "Snapchat",
  youtube: "YouTube",
};

/** Merge partial settings with defaults so no field is ever undefined. */
export function normalizeSettings(partial?: Partial<SiteSettings>): SiteSettings {
  return {
    footerEnabled: partial?.footerEnabled ?? defaultSiteSettings.footerEnabled,
    socialLinks: partial?.socialLinks ?? defaultSiteSettings.socialLinks,
    whatsappNumber: partial?.whatsappNumber ?? defaultSiteSettings.whatsappNumber,
    heroImages: partial?.heroImages ?? defaultSiteSettings.heroImages,
    activeHeroIndex: partial?.activeHeroIndex ?? defaultSiteSettings.activeHeroIndex,
    heroBadge: partial?.heroBadge ?? defaultSiteSettings.heroBadge,
    heroHeadline1: partial?.heroHeadline1 ?? defaultSiteSettings.heroHeadline1,
    heroHeadline2: partial?.heroHeadline2 ?? defaultSiteSettings.heroHeadline2,
    heroSubheadline: partial?.heroSubheadline ?? defaultSiteSettings.heroSubheadline,
    heroCtaPrimary: partial?.heroCtaPrimary ?? defaultSiteSettings.heroCtaPrimary,
    heroCtaSecondary: partial?.heroCtaSecondary ?? defaultSiteSettings.heroCtaSecondary,
  };
}

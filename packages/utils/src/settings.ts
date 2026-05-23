export interface SocialLink {
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "snapchat" | "youtube";
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  footerEnabled: boolean;
  socialLinks: SocialLink[];
  whatsappNumber: string;
}

export const defaultSocialLinks: SocialLink[] = [
  { platform: "facebook", url: "", enabled: false },
  { platform: "instagram", url: "https://instagram.com/urbandetox", enabled: true },
  { platform: "twitter", url: "", enabled: false },
  { platform: "linkedin", url: "", enabled: false },
  { platform: "snapchat", url: "", enabled: false },
  { platform: "youtube", url: "", enabled: false },
];

export const defaultSiteSettings: SiteSettings = {
  footerEnabled: true,
  socialLinks: defaultSocialLinks,
  whatsappNumber: "919876543210",
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
  };
}

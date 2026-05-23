import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { defaultSiteSettings, normalizeSettings, type SiteSettings } from "@urbandetox/utils";

const SETTINGS_KEY = "global";

async function getOrCreateSettings(): Promise<SiteSettings> {
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, SETTINGS_KEY));

  if (row) {
    return normalizeSettings(row.config as Partial<SiteSettings>);
  }

  await db.insert(siteSettings).values({
    key: SETTINGS_KEY,
    config: defaultSiteSettings,
    updatedAt: new Date(),
  });

  return defaultSiteSettings;
}

export const SettingsController = {
  async get(_req: Request, res: Response) {
    const settings = await getOrCreateSettings();
    res.json(settings);
  },

  async update(req: Request, res: Response) {
    const payload = req.body as Partial<SiteSettings>;

    const existing = await getOrCreateSettings();

    const merged: SiteSettings = {
      footerEnabled:
        typeof payload.footerEnabled === "boolean"
          ? payload.footerEnabled
          : existing.footerEnabled,
      socialLinks: payload.socialLinks ?? existing.socialLinks,
      whatsappNumber:
        typeof payload.whatsappNumber === "string"
          ? payload.whatsappNumber.trim()
          : existing.whatsappNumber,
      heroImages: Array.isArray(payload.heroImages)
        ? payload.heroImages
        : existing.heroImages,
      activeHeroIndex:
        typeof payload.activeHeroIndex === "number"
          ? payload.activeHeroIndex
          : existing.activeHeroIndex,
      heroBadge:
        typeof payload.heroBadge === "string"
          ? payload.heroBadge.trim()
          : existing.heroBadge,
      heroHeadline1:
        typeof payload.heroHeadline1 === "string"
          ? payload.heroHeadline1.trim()
          : existing.heroHeadline1,
      heroHeadline2:
        typeof payload.heroHeadline2 === "string"
          ? payload.heroHeadline2.trim()
          : existing.heroHeadline2,
      heroSubheadline:
        typeof payload.heroSubheadline === "string"
          ? payload.heroSubheadline.trim()
          : existing.heroSubheadline,
      heroCtaPrimary:
        typeof payload.heroCtaPrimary === "string"
          ? payload.heroCtaPrimary.trim()
          : existing.heroCtaPrimary,
      heroCtaSecondary:
        typeof payload.heroCtaSecondary === "string"
          ? payload.heroCtaSecondary.trim()
          : existing.heroCtaSecondary,
    };

    await db
      .update(siteSettings)
      .set({ config: merged, updatedAt: new Date() })
      .where(eq(siteSettings.key, SETTINGS_KEY));

    res.json(merged);
  },
} as const;

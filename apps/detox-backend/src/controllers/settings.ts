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
    };

    await db
      .update(siteSettings)
      .set({ config: merged, updatedAt: new Date() })
      .where(eq(siteSettings.key, SETTINGS_KEY));

    res.json(merged);
  },
} as const;

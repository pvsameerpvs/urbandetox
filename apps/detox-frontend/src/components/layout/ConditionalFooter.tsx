"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Footer } from "@/components/layout/footer";
import { fetchSiteSettings } from "@/lib/api";
import { defaultSiteSettings, normalizeSettings, type SiteSettings } from "@urbandetox/utils";

const HIDDEN_FOOTER_PATHS = ["/login"];

export function ConditionalFooter() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings | undefined>(undefined);

  useEffect(() => {
    fetchSiteSettings()
      .then((data) => setSettings(normalizeSettings(data)))
      .catch(() => {
        console.warn("[Footer] Backend unavailable — using default settings");
        setSettings(defaultSiteSettings);
      });
  }, []);

  if (HIDDEN_FOOTER_PATHS.includes(pathname ?? "")) return null;
  if (settings && !settings.footerEnabled) return null;

  return <Footer settings={settings} />;
}

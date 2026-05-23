"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Footer } from "@/components/layout/footer";
import { fetchSiteSettings } from "@/lib/api";
import { normalizeSettings, type SiteSettings } from "@urbandetox/utils";

const HIDDEN_FOOTER_PATHS = ["/login"];

export function ConditionalFooter() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings | undefined>(undefined);

  useEffect(() => {
    fetchSiteSettings()
      .then((data) => {
        const normalized = normalizeSettings(data);
        console.log("[Footer] Settings loaded:", normalized);
        setSettings(normalized);
      })
      .catch((err: unknown) => {
        console.error("[Footer] Failed to load settings:", err);
      });
  }, []);

  if (HIDDEN_FOOTER_PATHS.includes(pathname ?? "")) return null;
  if (settings && !settings.footerEnabled) return null;

  return <Footer settings={settings} />;
}

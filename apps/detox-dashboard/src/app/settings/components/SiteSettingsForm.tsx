"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Button, Badge } from "@urbandetox/ui";
import {
  type SiteSettings,
  type SocialLink,
  socialPlatformLabels,
  normalizeSettings,
} from "@urbandetox/utils";
import {
  Globe,
  ToggleLeft,
  ToggleRight,
  Save,
  Loader2,
  Phone,
} from "lucide-react";
import { fetchSiteSettings, updateSiteSettings } from "@/lib/api";
import { toast } from "sonner";

function SocialInput({
  link,
  onChange,
}: {
  link: SocialLink;
  onChange: (updated: SocialLink) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange({ ...link, enabled: !link.enabled })}
        className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
          link.enabled
            ? "bg-brand text-brand-foreground"
            : "bg-secondary text-muted-foreground"
        }`}
        aria-label={`Toggle ${socialPlatformLabels[link.platform]}`}
      >
        {link.enabled ? (
          <ToggleRight className="h-4 w-4" />
        ) : (
          <ToggleLeft className="h-4 w-4" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <label className="text-xs font-medium text-foreground">
          {socialPlatformLabels[link.platform]}
        </label>
        <input
          type="url"
          value={link.url}
          onChange={(e) => onChange({ ...link, url: e.target.value })}
          placeholder={`https://${link.platform}.com/yourhandle`}
          className="mt-1 h-9 w-full px-3 rounded-lg border border-input bg-white text-sm outline-none focus:border-brand/50 transition-colors"
        />
      </div>
    </div>
  );
}

export function SiteSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSiteSettings()
      .then((data) => setSettings(normalizeSettings(data)))
      .catch((err: unknown) => {
        console.error("[SiteSettings] fetch failed:", err);
        toast.error("Failed to load site settings");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRetry = () => {
    setLoading(true);
    fetchSiteSettings()
      .then((data) => setSettings(normalizeSettings(data)))
      .catch((err: unknown) => {
        console.error("[SiteSettings] retry failed:", err);
        toast.error("Still failed to load site settings");
      })
      .finally(() => setLoading(false));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      toast.success("Site settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border border-border/40 bg-white rounded-2xl">
        <CardContent className="p-8 flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading settings...</span>
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card className="border border-border/40 bg-white rounded-2xl">
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Could not load site settings.
          </p>
          <p className="text-xs text-muted-foreground">
            Make sure the backend is running on port 4000.
          </p>
          <Button
            onClick={handleRetry}
            disabled={loading}
            variant="outline"
            className="rounded-xl h-10 text-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              "Retry"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40 bg-white rounded-2xl">
      <CardContent className="p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Site Configuration</h3>
            <p className="text-xs text-muted-foreground">
              Control footer visibility and social media links.
            </p>
          </div>
        </div>

        {/* Footer Toggle */}
        <div className="flex items-center justify-between py-3 border-y border-border/40">
          <div>
            <p className="text-sm font-medium">Footer</p>
            <p className="text-xs text-muted-foreground">
              Show or hide the footer on the public site.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setSettings((prev) =>
                prev ? { ...prev, footerEnabled: !prev.footerEnabled } : prev
              )
            }
            className={`shrink-0 h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              settings.footerEnabled
                ? "bg-brand text-brand-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {settings.footerEnabled ? (
              <>
                <ToggleRight className="h-4 w-4" /> Enabled
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4" /> Disabled
              </>
            )}
          </button>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Social Media Links</p>
            <Badge variant="outline" className="text-[10px]">
              {settings.socialLinks.filter((s) => s.enabled && s.url).length}{" "}
              active
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settings.socialLinks.map((link, idx) => (
              <SocialInput
                key={link.platform}
                link={link}
                onChange={(updated) =>
                  setSettings((prev) =>
                    prev
                      ? {
                          ...prev,
                          socialLinks: prev.socialLinks.map((l, i) =>
                            i === idx ? updated : l
                          ),
                        }
                      : prev
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-brand" />
            <p className="text-sm font-medium">WhatsApp Number</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Include country code without + or spaces. Example: 919876543210
          </p>
          <input
            type="tel"
            value={settings.whatsappNumber}
            onChange={(e) =>
              setSettings((prev) =>
                prev ? { ...prev, whatsappNumber: e.target.value.trim() } : prev
              )
            }
            placeholder="919876543210"
            className="h-10 w-full px-3 rounded-lg border border-input bg-white text-sm outline-none focus:border-brand/50 transition-colors"
          />
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 text-sm font-semibold"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

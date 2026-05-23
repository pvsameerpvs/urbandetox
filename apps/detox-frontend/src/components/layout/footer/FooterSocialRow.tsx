import { Mail } from "lucide-react";
import { SocialIcon, WhatsAppIcon } from "./SocialIcons";
import type { SiteSettings, SocialLink } from "@urbandetox/utils";
import { socialPlatformLabels } from "@urbandetox/utils";

interface FooterSocialRowProps {
  settings?: SiteSettings;
}

function getActiveSocials(settings?: SiteSettings): SocialLink[] {
  const links = settings?.socialLinks ?? [];
  return links.filter((s) => s.enabled && s.url && s.url.trim().length > 0);
}

function getWhatsAppHref(settings?: SiteSettings): string | null {
  const number = settings?.whatsappNumber?.trim();
  if (!number) return null;
  return `https://wa.me/${number}`;
}

export function FooterSocialRow({ settings }: FooterSocialRowProps) {
  const activeSocials = getActiveSocials(settings);
  const whatsappHref = getWhatsAppHref(settings);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {activeSocials.map((social) => (
        <a
          key={social.platform}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={socialPlatformLabels[social.platform]}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 hover:bg-brand hover:text-white transition-all duration-300"
        >
          <SocialIcon platform={social.platform} className="h-4 w-4" />
        </a>
      ))}

      <a
        href="mailto:hello@urbandetox.in"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Email"
        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 hover:bg-brand hover:text-white transition-all duration-300"
      >
        <Mail className="h-4 w-4" />
      </a>

      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 hover:bg-brand hover:text-white transition-all duration-300"
        >
          <WhatsAppIcon className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

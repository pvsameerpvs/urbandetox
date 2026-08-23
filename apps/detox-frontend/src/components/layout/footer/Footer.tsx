import { FooterBrandColumn } from "./FooterBrandColumn";
import { FooterLinkGroup } from "./FooterLinkGroup";
import { FooterBottomBar } from "./FooterBottomBar";
import type { SiteSettings } from "@urbandetox/utils";

const DISCOVER_LINKS = [
  { label: "Explore Detox", href: "/detox" },
  { label: "Travel Guide", href: "/guide" },
  { label: "FAQs", href: "/faqs" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Corporate Retreats", href: "/corporate-retreats" },
  { label: "University Trips", href: "/university-trips" },
  { label: "Become a Guide", href: "/join-us" },
];

const ACCOUNT_LINKS = [
  { label: "Log In", href: "/login" },
  { label: "My Profile", href: "/profile" },
  { label: "My Detox", href: "/my-detox" },
];

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="w-full bg-footer text-footer-foreground relative overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--footer-foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 py-14 sm:py-16">
          <FooterBrandColumn settings={settings} />
          <FooterLinkGroup title="Discover" links={DISCOVER_LINKS} />
          <FooterLinkGroup title="Company" links={COMPANY_LINKS} />
          <FooterLinkGroup title="Account" links={ACCOUNT_LINKS} />
        </div>

        <FooterBottomBar />
      </div>
    </footer>
  );
}

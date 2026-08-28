import { FooterBrandColumn } from "./FooterBrandColumn";
import { FooterLinkGroup } from "./FooterLinkGroup";
import { FooterBottomBar } from "./FooterBottomBar";
import type { SiteSettings } from "@urbandetox/utils";

// Split 4/4 rather than 3/5. In the two-column mobile grid a row is as tall as
// its tallest cell, so a 3-link group beside a 5-link one left two rows of dead
// space. The two trip formats also sit better under Discover than under Company.
const DISCOVER_LINKS = [
  { label: "Explore Detox", href: "/detox" },
  { label: "Travel Guide", href: "/guide" },
  { label: "Corporate Retreats", href: "/corporate-retreats" },
  { label: "University Trips", href: "/university-trips" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Become a Guide", href: "/join-us" },
];

const ACCOUNT_LINKS = [
  { label: "Log In", href: "/login" },
  { label: "My Profile", href: "/profile" },
  { label: "My Detox", href: "/my-detox" },
];

// Promoted out of FooterBottomBar, where they were 11px and easy to miss.
// They are not duplicated: the bottom bar no longer carries them.
const LEGAL_LINKS = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/terms#privacy-policy" },
  { label: "Cancellation", href: "/terms#cancellation-and-refund-policy" },
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
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 py-12 sm:gap-10 sm:py-14 lg:grid-cols-6 lg:py-16">
          <FooterBrandColumn settings={settings} />
          <FooterLinkGroup title="Discover" links={DISCOVER_LINKS} />
          <FooterLinkGroup title="Company" links={COMPANY_LINKS} />
          <FooterLinkGroup title="Account" links={ACCOUNT_LINKS} />
          <FooterLinkGroup title="Legal" links={LEGAL_LINKS} />
        </div>

        <FooterBottomBar />
      </div>
    </footer>
  );
}

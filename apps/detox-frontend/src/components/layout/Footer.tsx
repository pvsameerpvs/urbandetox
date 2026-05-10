import Link from "next/link";
import Image from "next/image";
import { Leaf, Globe, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Discover: [
    { label: "Explore Detox", href: "/detox" },
    { label: "Upcoming Detox", href: "/detox" },
    { label: "Guide", href: "/guide" },
    { label: "FAQs", href: "/faqs" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Corporate Retreats", href: "/corporate-retreats" },
    { label: "University Trips", href: "/university-trips" },
  ],
  Account: [
    { label: "Log In", href: "/login" },
    { label: "My Profile", href: "/profile" },
    { label: "My Detox", href: "/my-detox" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-5">
            <Link href="/" className="block">
              <Image
                src="/log-detox.png"
                alt="Urban Detox"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Disconnect from routine. Step into curated offbeat escapes designed for real reset.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="https://instagram.com/urbandetox" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-brand transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="mailto:hello@urbandetox.in" className="text-muted-foreground hover:text-brand transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-brand transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={`${title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-brand transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Urban Detox. All rights reserved.</p>
          <p className="text-xs">Built with intention. Calm, premium, real.</p>
        </div>
      </div>
    </footer>
  );
}

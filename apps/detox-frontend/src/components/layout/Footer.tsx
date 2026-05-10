"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

const discoverLinks = [
  { label: "Explore Detox", href: "/detox" },
  { label: "Travel Guide", href: "/guide" },
  { label: "FAQs", href: "/faqs" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Corporate Retreats", href: "/corporate-retreats" },
  { label: "University Trips", href: "/university-trips" },
];

const accountLinks = [
  { label: "Log In", href: "/login" },
  { label: "My Profile", href: "/profile" },
  { label: "My Detox", href: "/my-detox" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/urbandetox", label: "Instagram" },
  { icon: Mail, href: "mailto:hello@urbandetox.in", label: "Email" },
  { icon: Phone, href: "https://wa.me/919876543210", label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#0a1628] text-white relative overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 py-14 sm:py-16">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/log-detox-white.png"
                alt="Urban Detox"
                width={160}
                height={48}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-6">
              Disconnect from routine. Step into curated offbeat escapes designed for real reset.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 hover:bg-brand hover:text-white transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
              Discover
            </h4>
            <ul className="flex flex-col gap-3">
              {discoverLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
              Account
            </h4>
            <ul className="flex flex-col gap-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-white/10 text-xs text-white/40">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>© {new Date().getFullYear()} Urban Detox. All rights reserved.</p>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-2 text-white/50">
              <MapPin className="h-3 w-3" />
              <span>Bangalore, India</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white/60 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white/60 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

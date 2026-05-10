"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Discover: [
    { label: "Explore Detox", href: "/detox" },
    { label: "Upcoming Trips", href: "/detox" },
    { label: "Travel Guide", href: "/guide" },
    { label: "FAQs", href: "/faqs" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Corporate Retreats", href: "/corporate-retreats" },
    { label: "University Trips", href: "/university-trips" },
  ],
  Account: [
    { label: "Log In", href: "/login" },
    { label: "My Profile", href: "/profile" },
    { label: "My Detox", href: "/my-detox" },
  ],
  Legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cancellation Policy", href: "#" },
  ],
};

const socialLinks = [
  {
    icon: Instagram,
    href: "https://instagram.com/urbandetox",
    label: "Instagram",
  },
  {
    icon: Mail,
    href: "mailto:hello@urbandetox.in",
    label: "Email",
  },
  {
    icon: Phone,
    href: "https://wa.me/919876543210",
    label: "WhatsApp",
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#0a1628] text-white relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
          {/* Top section: Logo + tagline */}
          <div className="pb-12 sm:pb-16 border-b border-white/10">
            <div className="flex flex-col gap-6">
              <Link href="/" className="inline-block">
                <Image
                  src="/log-detox-white.png"
                  alt="Urban Detox"
                  width={180}
                  height={52}
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-sm">
                Disconnect from routine. Step into curated offbeat escapes
                designed for real reset.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-white/50">
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4" /> hello@urbandetox.in
                </span>
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" /> +91-98765-43210
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Bangalore, India
                </span>
              </div>
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 sm:py-16">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
                  {title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={`${title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        {link.href.startsWith("http") && (
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social + Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
            {/* Social icons */}
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

            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs text-white/40">
              <p>© {new Date().getFullYear()} Urban Detox. All rights reserved.</p>
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
        </div>
      </div>
    </footer>
  );
}

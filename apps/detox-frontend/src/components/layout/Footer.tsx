"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, Phone } from "lucide-react";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Detox", href: "/detox" },
  { label: "Guide", href: "/guide" },
  { label: "FAQs", href: "/faqs" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/urbandetox", label: "Instagram" },
  { icon: Mail, href: "mailto:hello@urbandetox.in", label: "Email" },
  { icon: Phone, href: "https://wa.me/919876543210", label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#0a1628] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main row: logo + links + social */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 sm:py-10 border-b border-white/10">
          {/* Logo */}
          <Link href="/" className="inline-block shrink-0">
            <Image
              src="/log-detox-white.png"
              alt="Urban Detox"
              width={140}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-2 shrink-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white/60 hover:bg-brand hover:text-white transition-all duration-300"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Urban Detox</p>
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

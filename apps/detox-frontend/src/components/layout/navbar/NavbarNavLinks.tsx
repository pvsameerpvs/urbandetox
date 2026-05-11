"use client";

import Link from "next/link";
import { cn } from "@urbandetox/utils";
import { NAV_LINKS } from "./nav-data";
import { useActiveLink } from "./use-active-link";

interface NavLinkItemProps {
  href: string;
  label: string;
  isLightMode: boolean;
  onClick?: () => void;
}

function NavLinkItem({ href, label, isLightMode, onClick }: NavLinkItemProps) {
  const isActive = useActiveLink(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-base font-bold tracking-wide transition-colors duration-200 hover:opacity-80 uppercase",
        isLightMode
          ? isActive
            ? "text-brand"
            : "text-foreground hover:text-brand"
          : "text-white/95 hover:text-white"
      )}
    >
      {label}
    </Link>
  );
}

interface NavbarNavLinksProps {
  isLightMode: boolean;
  mobile?: boolean;
  onLinkClick?: () => void;
}

export function NavbarNavLinks({ isLightMode, mobile, onLinkClick }: NavbarNavLinksProps) {
  if (mobile) {
    return (
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map((link) => (
          <NavLinkItem
            key={link.href}
            href={link.href}
            label={link.label}
            isLightMode={true}
            onClick={onLinkClick}
          />
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-10">
      {NAV_LINKS.map((link) => (
        <NavLinkItem
          key={link.href}
          href={link.href}
          label={link.label}
          isLightMode={isLightMode}
        />
      ))}
    </nav>
  );
}

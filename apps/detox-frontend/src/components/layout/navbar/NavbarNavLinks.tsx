"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-data";
import { useActiveLink } from "./use-active-link";

interface NavLinkItemProps {
  href: string;
  label: string;
  mobile?: boolean;
  onClick?: () => void;
}

function NavLinkItem({ href, label, mobile, onClick }: NavLinkItemProps) {
  const isActive = useActiveLink(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "font-medium transition-colors hover:text-brand",
        mobile ? "text-base" : "text-sm",
        isActive ? "text-brand" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );
}

interface NavbarNavLinksProps {
  mobile?: boolean;
  onLinkClick?: () => void;
}

export function NavbarNavLinks({ mobile, onLinkClick }: NavbarNavLinksProps) {
  const className = mobile
    ? "flex flex-col gap-3"
    : "hidden md:flex items-center gap-6";

  return (
    <nav className={className}>
      {NAV_LINKS.map((link) => (
        <NavLinkItem
          key={link.href}
          href={link.href}
          label={link.label}
          mobile={mobile}
          onClick={onLinkClick}
        />
      ))}
    </nav>
  );
}

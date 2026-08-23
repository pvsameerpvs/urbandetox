"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

/**
 * The auth screens are full-bleed and carry their own logo, so the site
 * navbar would show a second one and push the 100dvh panel past the fold.
 * ConditionalFooter already hid the footer on /login for the same reason.
 */
const HIDDEN_NAVBAR_PATHS = ["/login", "/reset-password"];

export function ConditionalNavbar() {
  const pathname = usePathname();
  if (HIDDEN_NAVBAR_PATHS.includes(pathname ?? "")) return null;
  return <Navbar />;
}

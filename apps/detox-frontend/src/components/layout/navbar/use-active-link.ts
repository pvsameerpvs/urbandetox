"use client";

import { usePathname } from "next/navigation";

export function useActiveLink(href: string): boolean {
  const pathname = usePathname();

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

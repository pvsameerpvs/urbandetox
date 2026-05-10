"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";

const HIDDEN_FOOTER_PATHS = ["/login"];

export function ConditionalFooter() {
  const pathname = usePathname();
  if (HIDDEN_FOOTER_PATHS.includes(pathname ?? "")) return null;
  return <Footer />;
}

"use client";

import { useState, useEffect, startTransition } from "react";
import { usePathname } from "next/navigation";

export function useNavbarTheme() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      startTransition(() => setScrolled(true));
      return;
    }

    startTransition(() => setScrolled(false));
    const handleScroll = () => {
      startTransition(() => setScrolled(window.scrollY > 50));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const isLightMode = !isHomePage || scrolled;
  const showSpacer = !isHomePage;

  return { isLightMode, showSpacer };
}

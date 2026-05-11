"use client";

import { cn } from "@urbandetox/utils";
import { useNavbarTheme } from "./hooks/use-navbar-theme";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarNavLinks } from "./NavbarNavLinks";
import { NavbarActions } from "./NavbarActions";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const { isLightMode, showSpacer } = useNavbarTheme();

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isLightMode
            ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-border/40"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-20 sm:h-[88px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavbarLogo isLightMode={isLightMode} />
          <NavbarNavLinks isLightMode={isLightMode} />
          <NavbarActions isLightMode={isLightMode} />
          <MobileMenu isLightMode={isLightMode} />
        </div>
      </header>

      {showSpacer && <div className="h-20 sm:h-[88px]" />}
    </>
  );
}

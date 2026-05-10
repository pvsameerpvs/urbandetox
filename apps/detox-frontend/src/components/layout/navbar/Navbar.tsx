"use client";

import { NavbarLogo } from "./NavbarLogo";
import { NavbarNavLinks } from "./NavbarNavLinks";
import { NavbarActions } from "./NavbarActions";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavbarLogo />
        <NavbarNavLinks />
        <NavbarActions />
        <MobileMenu />
      </div>
    </header>
  );
}

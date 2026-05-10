"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarNavLinks } from "./NavbarNavLinks";
import { NavbarActions } from "./NavbarActions";

interface MobileMenuProps {
  isLightMode: boolean;
}

export function MobileMenu({ isLightMode }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          "md:hidden p-2 rounded-lg transition-colors",
          isLightMode
            ? "text-foreground hover:bg-secondary"
            : "text-white hover:bg-white/10"
        )}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="right" className="w-80 bg-white">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex flex-col gap-6 pt-6">
          <NavbarLogo isLightMode={true} onClick={handleClose} />
          <NavbarNavLinks isLightMode={true} mobile onLinkClick={handleClose} />
          <NavbarActions isLightMode={true} mobile onClick={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarNavLinks } from "./NavbarNavLinks";
import { NavbarActions } from "./NavbarActions";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "md:hidden"
        )}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="right" className="w-80">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex flex-col gap-6 pt-6">
          <NavbarLogo onClick={handleClose} />
          <NavbarNavLinks mobile onLinkClick={handleClose} />
          <NavbarActions mobile onClick={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

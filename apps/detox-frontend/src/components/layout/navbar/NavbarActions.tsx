"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavbarActionsProps {
  mobile?: boolean;
  onClick?: () => void;
}

export function NavbarActions({ mobile, onClick }: NavbarActionsProps) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-3 pt-4 border-t">
        <Button variant="outline" size="sm" asChild onClick={onClick}>
          <Link href="/login">Log In</Link>
        </Button>
        <Button
          size="sm"
          className="bg-brand text-brand-foreground hover:bg-brand/90"
          asChild
          onClick={onClick}
        >
          <Link href="/detox">Explore Detox</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Log In</Link>
      </Button>
      <Button
        size="sm"
        className="bg-brand text-brand-foreground hover:bg-brand/90"
        asChild
      >
        <Link href="/detox">Explore Detox</Link>
      </Button>
    </div>
  );
}

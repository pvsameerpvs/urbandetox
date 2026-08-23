"use client";

import { Menu } from "lucide-react";
import { Button } from "@urbandetox/ui";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

/**
 * Deliberately sparse.
 *
 * This used to carry a search input with no handler of any kind, and a
 * notification bell with no onClick whose red "unread" dot was hardcoded on,
 * so it always claimed there was something to read. Both looked functional and
 * neither was. A control that lies is worse than an absent one, so they are
 * gone until there is a real global search and a real notification feed to
 * point them at.
 */
export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border/40 bg-white/80 backdrop-blur-md px-4 font-sans sm:px-6">
      <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation</span>
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15">
          <span className="text-xs font-bold text-brand">AD</span>
        </div>
      </div>
    </header>
  );
}

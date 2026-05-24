"use client";

import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@urbandetox/ui";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border/40 bg-white/80 backdrop-blur-md px-4 sm:px-6 font-sans">
      <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center gap-3">
        <div className="relative hidden sm:block max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-full rounded-lg border border-border/60 bg-secondary/30 pl-9 pr-3 text-sm outline-none focus:border-brand/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-brand/15 flex items-center justify-center">
          <span className="text-xs font-bold text-brand">AD</span>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useUserProfile } from "@/lib/user-profile";
import { User, MapPin, Settings, LogOut, ChevronDown, Compass } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback, Button, Separator } from "@urbandetox/ui"

export function ProfileDropdown() {
  const { authUser, logout, profile } = useUserProfile();
  const router = useRouter();

  const displayName = profile.personal.fullName || authUser?.fullName || "User";
  const email = authUser?.email || profile.personal.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-secondary/80 transition-colors">
          <Avatar className="h-8 w-8 border border-border/40 shadow-sm">
            {authUser?.avatarUrl ? <AvatarImage src={authUser.avatarUrl} alt={displayName} /> : null}
            <AvatarFallback className="bg-brand text-brand-foreground text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden xl:block text-sm font-semibold max-w-[100px] truncate">{displayName}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border/40 shadow-sm">
              {authUser?.avatarUrl ? <AvatarImage src={authUser.avatarUrl} alt={displayName} /> : null}
              <AvatarFallback className="bg-brand text-brand-foreground text-sm font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        </div>
        <Separator />
        <nav className="p-2">
          <Link href="/profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <User className="h-4 w-4 text-muted-foreground" /> Profile
          </Link>
          <Link href="/my-detox" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">My Detox</span>
          </Link>
          <Link href="/detox" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Compass className="h-4 w-4 text-muted-foreground" /> Explore Detox
          </Link>
          <Link href="/profile/personal" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Settings className="h-4 w-4 text-muted-foreground" /> Settings
          </Link>
        </nav>
        <Separator />
        <div className="p-2">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2.5 text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "./ProfileDropdown";
import { useUserProfile } from "@/lib/user-profile";

interface NavbarActionsProps {
  isLightMode: boolean;
  mobile?: boolean;
  onClick?: () => void;
}

export function NavbarActions({ isLightMode, mobile, onClick }: NavbarActionsProps) {
  const { isLoggedIn, isHydrated } = useUserProfile();

  if (mobile) {
    if (!isHydrated) return null;
    if (isLoggedIn) {
      return (
        <div className="pt-4 border-t space-y-2">
          <Button variant="outline" className="w-full h-12 rounded-xl font-bold" asChild>
            <Link href="/profile" onClick={onClick}>My Profile</Link>
          </Button>
          <Button className="w-full bg-brand text-brand-foreground hover:bg-brand/90 h-12 font-bold" asChild>
            <Link href="/my-detox" onClick={onClick}>My Detox</Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="pt-4 border-t">
        <Button className="w-full bg-brand text-brand-foreground hover:bg-brand/90 h-12 font-bold uppercase tracking-wide" asChild>
          <Link href="/login" onClick={onClick}>
            Log In
          </Link>
        </Button>
      </div>
    );
  }

  if (!isHydrated) {
    return (
      <div className="hidden md:flex items-center gap-4">
        <div className="h-11 w-24 rounded-full bg-secondary/60 animate-pulse" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="hidden md:flex items-center gap-3">
        <ProfileDropdown />
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-4">
      <Button
        variant="outline"
        className={`h-11 px-6 text-sm font-bold rounded-full transition-all duration-300 uppercase tracking-wide ${
          isLightMode
            ? "border-border bg-transparent text-foreground hover:bg-secondary"
            : "border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
        }`}
        asChild
      >
        <Link href="/login">Log In</Link>
      </Button>
    </div>
  );
}

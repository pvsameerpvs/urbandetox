"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Compass,
  BookOpen,
  UserPlus,
  Info,
  Phone,
  LogIn,
  MapPin,
  ArrowRight,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@urbandetox/utils";
import { useUserProfile } from "@/lib/user-profile";
import {
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@urbandetox/ui";

const navLinks = [
  { href: "/detox", label: "Explore Detox", icon: Compass, desc: "Browse all retreats" },
  { href: "/guide", label: "Travel Guide", icon: BookOpen, desc: "Travel stories & tips" },
  { href: "/join-us", label: "Become a Guide", icon: UserPlus, desc: "Apply to guide our trips" },
  { href: "/about", label: "About", icon: Info, desc: "Who we are" },
  { href: "/contact", label: "Contact", icon: Phone, desc: "Get in touch" },
];

interface MobileMenuProps {
  isLightMode: boolean;
}

export function MobileMenu({ isLightMode }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const { profile, authUser, isLoggedIn, logout, isHydrated } = useUserProfile();
  const router = useRouter();

  const initials = profile.personal.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Hamburger Trigger */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "md:hidden p-2 rounded-xl transition-colors",
          isLightMode
            ? "text-foreground hover:bg-secondary"
            : "text-white hover:bg-white/10"
        )}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[70] h-dvh w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <Link href="/" onClick={() => setOpen(false)} className="inline-block">
            <Image
              src="/log-detox.png"
              alt="Urban Detox"
              width={130}
              height={36}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile Section (when logged in) */}
          {isHydrated && isLoggedIn && (
            <div className="px-5 py-4 border-b border-border/30 bg-secondary/20">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10 border border-border/40 shadow-sm">
                  {authUser?.avatarUrl ? (
                    <AvatarImage src={authUser.avatarUrl} alt={profile.personal.fullName} />
                  ) : null}
                  <AvatarFallback className="bg-brand text-brand-foreground text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{profile.personal.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.personal.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg text-xs font-medium"
                  asChild
                >
                  <Link href="/profile" onClick={() => setOpen(false)}>
                    <User className="mr-1.5 h-3.5 w-3.5" /> Profile
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="h-9 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-medium"
                  asChild
                >
                  <Link href="/my-detox" onClick={() => setOpen(false)}>
                    <MapPin className="mr-1.5 h-3.5 w-3.5" /> My Detox
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <nav className="p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2 px-3">
              Menu
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3.5 rounded-xl px-3 py-3 text-sm font-semibold text-foreground hover:bg-secondary/60 transition-colors group"
              >
                <div className="inline-flex items-center justify-center rounded-lg bg-brand/10 h-9 w-9 shrink-0 group-hover:bg-brand/20 transition-colors">
                  <link.icon className="h-4 w-4 text-brand" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{link.label}</p>
                  <p className="text-[11px] text-muted-foreground">{link.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 ml-auto group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </nav>

          {/* Destinations Quick Links */}
          <div className="px-5 py-3 border-t border-border/30">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Popular Detoxes
            </p>
            <div className="flex flex-wrap gap-2">
              {["Kodaikanal", "North Kerala", "Gokarna"].map((dest) => (
                <Link
                  key={dest}
                  href="/detox"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-brand/10 hover:text-brand transition-colors"
                >
                  <MapPin className="h-3 w-3" /> {dest}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-5 border-t border-border/30 bg-secondary/20 shrink-0">
          {isHydrated && isLoggedIn ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 text-sm font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          ) : (
            <>
              <Button
                className="w-full h-11 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-sm font-semibold shadow-sm"
                asChild
              >
                <Link href="/login" onClick={() => setOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" /> Log In
                </Link>
              </Button>
              <p className="text-center text-[11px] text-muted-foreground mt-3">
                Or{" "}
                <Link
                  href="/detox"
                  onClick={() => setOpen(false)}
                  className="text-brand hover:underline font-medium"
                >
                  book a detox first
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

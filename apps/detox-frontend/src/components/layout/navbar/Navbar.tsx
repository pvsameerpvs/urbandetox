"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/guide", label: "Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // For non-homepage, start as scrolled (light mode)
    if (!isHomePage) {
      setScrolled(true);
    } else {
      setScrolled(false);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Determine styles based on page and scroll state
  const isLightMode = !isHomePage || scrolled;

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
        <div className="mx-auto flex h-20 sm:h-22 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={isLightMode ? "/log-detox.png" : "/log-detox-white.png"}
              alt="Urban Detox"
              width={160}
              height={160}
              className="h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base font-bold tracking-wide transition-colors duration-200 hover:opacity-80 uppercase",
                  isLightMode
                    ? "text-foreground hover:text-brand"
                    : "text-white/95 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              className={cn(
                "h-11 px-6 text-sm font-bold rounded-full transition-all duration-300 uppercase tracking-wide",
                isLightMode
                  ? "border-border bg-transparent text-foreground hover:bg-secondary"
                  : "border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              )}
              asChild
            >
              <Link href="/login">Log In</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
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
                {/* Mobile Logo */}
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/log-detox.png"
                    alt="Urban Detox"
                    width={120}
                    height={120}
                    className="h-24 w-24 object-contain"
                  />
                </Link>

                {/* Mobile Links */}
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-base font-bold text-foreground hover:text-brand py-3 px-3 rounded-lg hover:bg-secondary/50 transition-colors uppercase tracking-wide"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Login */}
                <div className="pt-4 border-t">
                  <Button
                    className="w-full bg-brand text-brand-foreground hover:bg-brand/90 h-12 font-bold uppercase tracking-wide"
                    asChild
                  >
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Spacer for non-homepage pages to account for fixed navbar */}
      {!isHomePage && <div className="h-20 sm:h-22" />}
    </>
  );
}

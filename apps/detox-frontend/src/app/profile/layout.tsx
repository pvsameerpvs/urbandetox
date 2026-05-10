"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Heart, FileText, PhoneCall, ArrowLeft } from "lucide-react";

const navItems = [
  { label: "Personal Details", href: "/profile/personal", icon: User },
  { label: "Preferences", href: "/profile/preferences", icon: Heart },
  { label: "Documents", href: "/profile/documents", icon: FileText },
  { label: "Emergency Contact", href: "/profile/emergency", icon: PhoneCall },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your personal information, preferences, and documents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0",
                      isActive
                        ? "bg-brand text-brand-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </main>
  );
}

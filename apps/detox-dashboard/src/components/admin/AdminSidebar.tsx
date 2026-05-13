"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@urbandetox/utils";
import { useBookingNotifications } from "@/components/admin/BookingNotificationContext";
import {
  LayoutDashboard,
  MapPin,
  Package,
  CalendarDays,
  BookOpen,
  Tag,
  Users,
  Settings,
  Image as ImageIcon,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/destinations", label: "Destinations", icon: MapPin },
  { href: "/packages", label: "Packages", icon: Package },
  { href: "/departures", label: "Departures", icon: CalendarDays },
  { href: "/bookings", label: "Bookings", icon: BookOpen, badge: true },
  { href: "/guides", label: "Guides", icon: BookOpen },
  { href: "/hero", label: "Hero Image", icon: ImageIcon },
  { href: "/seasonal-tags", label: "Seasonal Tags", icon: Tag },
  { href: "/users", label: "Users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { unreadCount } = useBookingNotifications();

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-[260px] bg-sidebar-dark border-r border-white/5 hidden lg:flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center">
          <span className="text-brand-foreground font-bold text-sm">UD</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Urban Detox</p>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const showBadge = item.badge && unreadCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand/15 text-brand"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-brand-foreground">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { type BookingState } from "@urbandetox/utils";
import { getDepartureByCode, getPackageBySlug } from "@/lib/admin-data";

interface BookingNotificationContextValue {
  unreadCount: number;
  clearUnread: () => void;
}

const BookingNotificationContext = createContext<BookingNotificationContextValue | null>(null);

export function useBookingNotifications() {
  const ctx = useContext(BookingNotificationContext);
  if (!ctx) throw new Error("useBookingNotifications must be used within BookingNotificationProvider");
  return ctx;
}

async function getBookingMeta(booking: BookingState) {
  const dep = await getDepartureByCode(booking.departureCode);
  const pkg = dep ? await getPackageBySlug(dep.packageSlug) : undefined;
  const primary = booking.travelers.find((t) => t.type === "primary");
  return {
    name: primary?.name || "New traveler",
    packageTitle: pkg?.title || dep?.packageSlug || "Unknown package",
  };
}

function getBookingKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("urbandetox-booking-")) {
      keys.push(key);
    }
  }
  return keys.sort();
}

export function BookingNotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const seenKeysRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize seen keys silently (no toasts on first load)
    const initKeys = getBookingKeys();
    seenKeysRef.current = new Set(initKeys);
    initializedRef.current = true;

    const interval = setInterval(async () => {
      const currentKeys = getBookingKeys();
      const prevSeen = seenKeysRef.current;
      const newKeys = currentKeys.filter((k) => !prevSeen.has(k));

      if (newKeys.length > 0) {
        // Update seen set first
        const nextSeen = new Set(prevSeen);
        newKeys.forEach((k) => nextSeen.add(k));
        seenKeysRef.current = nextSeen;

        // Show toasts for each new booking
        for (const key of newKeys) {
          try {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            const booking: BookingState = JSON.parse(raw);
            const meta = await getBookingMeta(booking);
            toast.success(`New booking from ${meta.name} — ${meta.packageTitle}`, {
              description: `${booking.travelers.length} traveler${booking.travelers.length > 1 ? "s" : ""}`,
              duration: 6000,
            });
          } catch {
            // skip corrupted entries
          }
        }

        // Increment unread count
        setUnreadCount((prev) => prev + newKeys.length);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BookingNotificationContext.Provider value={{ unreadCount, clearUnread }}>
      {children}
    </BookingNotificationContext.Provider>
  );
}

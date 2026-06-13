"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { getAllBookings } from "@/lib/bookings";

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

export function BookingNotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const seenStatesRef = useRef<Map<string, string>>(new Map());
  const initializedRef = useRef(false);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const bookings = await getAllBookings();
        if (!active) return;

        if (!initializedRef.current) {
          seenStatesRef.current = new Map(
            bookings.map((booking) => [
              booking.id,
              `${booking.bookingStatus}:${booking.paymentStatus}`,
            ])
          );
          initializedRef.current = true;
          return;
        }

        const newBookings = bookings.filter(
          (booking) => !seenStatesRef.current.has(booking.id)
        );
        const changedBookings = bookings.filter((booking) => {
          const previous = seenStatesRef.current.get(booking.id);
          return (
            previous !== undefined &&
            previous !== `${booking.bookingStatus}:${booking.paymentStatus}`
          );
        });
        if (newBookings.length === 0 && changedBookings.length === 0) return;

        bookings.forEach((booking) =>
          seenStatesRef.current.set(
            booking.id,
            `${booking.bookingStatus}:${booking.paymentStatus}`
          )
        );
        for (const booking of newBookings) {
          const needsReview = booking.bookingStatus === "payment_review";
          const message = needsReview
            ? `Paid booking needs review — ${booking.primaryName}`
            : `New booking from ${booking.primaryName}`;
          toast[needsReview ? "warning" : "success"](message, {
            description: `${booking.departureCode} · ${booking.travelerCount} traveler${booking.travelerCount !== 1 ? "s" : ""}`,
            duration: 6000,
          });
        }
        for (const booking of changedBookings) {
          if (booking.paymentStatus === "refunded") {
            toast.info(`Booking refunded — ${booking.primaryName}`, {
              description: booking.departureCode,
              duration: 6000,
            });
          } else {
            toast.info(`Booking status updated — ${booking.primaryName}`, {
              description: `${booking.departureCode} · ${booking.bookingStatus}`,
              duration: 6000,
            });
          }
        }
        setUnreadCount(
          (previous) => previous + newBookings.length + changedBookings.length
        );
      } catch {
        // Authentication may still be loading, or the API may be temporarily unavailable.
      }
    };

    void poll();
    const interval = window.setInterval(() => void poll(), 15000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <BookingNotificationContext.Provider value={{ unreadCount, clearUnread }}>
      {children}
    </BookingNotificationContext.Provider>
  );
}

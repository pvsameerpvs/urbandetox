"use client";

import Link from "next/link";
;
;
;
;
import {
  Calendar,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserProfile } from "@/lib/user-profile";
import { quickLinks, recentBookings } from "./data";
import { Card, CardContent, Badge, Avatar, AvatarImage, AvatarFallback, Button } from "@urbandetox/ui"

export default function ProfileDashboard() {
  const { profile, authUser } = useUserProfile();
  const initials = profile.personal.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Profile card */}
      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
        <div className="relative h-28 sm:h-36 bg-gradient-to-r from-brand/60 via-brand to-brand/60">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
        <CardContent className="relative px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-14">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white shadow-lg overflow-hidden">
              {authUser?.avatarUrl ? <AvatarImage src={authUser.avatarUrl} alt={profile.personal.fullName} /> : null}
              <AvatarFallback className="bg-brand text-brand-foreground text-xl sm:text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-2 sm:pt-0 sm:pb-1">
              <h2 className="text-xl sm:text-2xl font-bold">{profile.personal.fullName}</h2>
              <p className="text-sm text-muted-foreground">{profile.personal.email} · {profile.personal.phone}</p>
            </div>
            <Badge className="bg-brand/10 text-brand border-0 text-xs font-medium">Member since 2024</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick links grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="group">
              <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl hover:shadow-xl transition-all duration-500">
                <CardContent className="p-5 sm:p-6 flex items-center gap-4">
                  <div className="shrink-0 inline-flex items-center justify-center rounded-xl bg-brand/10 p-3 group-hover:bg-brand/15 transition-colors">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base group-hover:text-brand transition-colors">{link.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-0.5 transition-all shrink-0" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Recent Bookings</h3>
          <Link
            href="/my-detox"
            className="text-sm font-medium text-brand hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
            <CardContent className="p-8 sm:p-10 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
              <h4 className="font-bold mb-1">No bookings yet</h4>
              <p className="text-sm text-muted-foreground mb-4">Start your detox journey today.</p>
              <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-5" asChild>
                <Link href="/detox">Explore Detox <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <Card key={booking.id} className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl hover:shadow-md transition-all duration-300">
                <CardContent className="p-5 sm:p-6 flex items-center gap-4">
                  <div className="shrink-0 inline-flex items-center justify-center rounded-xl bg-secondary p-3">
                    {booking.status === "upcoming" ? (
                      <Clock className="h-5 w-5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-sm">{booking.title}</h4>
                      <Badge
                        className={
                          booking.status === "upcoming"
                            ? "bg-amber-100 text-amber-700 border-0 text-[10px]"
                            : "bg-emerald-100 text-emerald-700 border-0 text-[10px]"
                        }
                      >
                        {booking.status === "upcoming" ? "Upcoming" : "Completed"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {booking.date}
                      <MapPin className="h-3 w-3 ml-1" />
                      {booking.destination}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

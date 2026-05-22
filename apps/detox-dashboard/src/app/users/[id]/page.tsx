"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Card, CardContent, Badge } from "@urbandetox/ui";
import { InfoItem } from "../components/InfoItem";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Droplets,
  ShieldCheck,
  Package,
  Clock,
  Loader2,
} from "lucide-react";
import { fetchUserById } from "@/lib/api";
import { toast } from "sonner";

interface UserDetail {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  bookingsCount: number;
}

export default function UserDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchUserById(id);
        setUser(data as UserDetail);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load user";
        if (message.includes("404") || message.includes("not found")) {
          notFound();
        } else {
          toast.error(message);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!user) return notFound();

  const initials = (user.fullName || user.email).charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-brand/10 flex items-center justify-center">
            <span className="text-lg font-bold text-brand">{initials}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {user.fullName || "Unnamed User"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {user.gender && (
                <Badge variant="outline" className="text-[10px] h-5 border-border/40">
                  {user.gender}
                </Badge>
              )}
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <Card className="border border-border/40 rounded-2xl">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={user.email || ""} />
            <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone || ""} />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Date of Birth"
              value={user.dateOfBirth || ""}
            />
            <InfoItem
              icon={<Clock className="h-4 w-4" />}
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="border border-border/40 rounded-2xl">
          <CardContent className="p-4 text-center">
            <Package className="h-5 w-5 text-brand mx-auto mb-2" />
            <p className="text-xl font-bold">{user.bookingsCount}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Bookings</p>
          </CardContent>
        </Card>
        <Card className="border border-border/40 rounded-2xl">
          <CardContent className="p-4 text-center">
            <Calendar className="h-5 w-5 text-brand mx-auto mb-2" />
            <p className="text-xl font-bold">
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Last Updated</p>
          </CardContent>
        </Card>
        <Card className="border border-border/40 rounded-2xl">
          <CardContent className="p-4 text-center">
            <ShieldCheck className="h-5 w-5 text-brand mx-auto mb-2" />
            <p className="text-xl font-bold capitalize">{user.role}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Role</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
        <ShieldCheck className="h-3 w-3 mr-1" /> Admin
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px]">
      User
    </Badge>
  );
}

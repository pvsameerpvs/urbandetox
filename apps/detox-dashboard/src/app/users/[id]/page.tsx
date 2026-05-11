"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Card, CardContent, Badge } from "@urbandetox/ui";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Utensils,
  HeartPulse,
  Droplets,
  AlertTriangle,
  Contact,
  FileCheck,
  Package,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { getAllUsers } from "@/lib/users";

export default function UserDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const users = getAllUsers();
  const user = users.find((u) => u.id === id);

  if (!user) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link href="/users" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-brand/10 flex items-center justify-center">
            <span className="text-lg font-bold text-brand">{user.fullName.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{user.fullName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px] h-5 border-border/40">{user.gender}</Badge>
              {user.isLoggedIn ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                </Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px]">
                  <Clock className="h-3 w-3 mr-1" /> Offline
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <Card className="border border-border/40 rounded-2xl">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
            <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone} />
            <InfoItem icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={user.dateOfBirth} />
            <InfoItem icon={<Droplets className="h-4 w-4" />} label="Blood Group" value={user.bloodGroup} />
          </div>
        </CardContent>
      </Card>

      {/* Health */}
      <Card className="border border-border/40 rounded-2xl">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Health & Diet</h3>
          <InfoItem icon={<Utensils className="h-4 w-4" />} label="Food Preference" value={user.foodPreference} />
          {user.allergies && user.allergies !== "None" && (
            <div className="flex items-start gap-2 text-sm text-amber-600">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Allergies</p>
                <p className="text-xs">{user.allergies}</p>
              </div>
            </div>
          )}
          {user.medicalConditions && user.medicalConditions !== "None" && (
            <div className="flex items-start gap-2 text-sm text-red-500">
              <HeartPulse className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Medical Conditions</p>
                <p className="text-xs">{user.medicalConditions}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency */}
      <Card className="border border-border/40 rounded-2xl">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Emergency Contact</h3>
          <div className="flex items-center gap-2 text-sm">
            <Contact className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{user.emergencyName}</span>
            <Badge variant="outline" className="text-[10px] h-4 border-border/40">{user.emergencyRelation}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{user.emergencyPhone}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border border-border/40 rounded-2xl">
          <CardContent className="p-4 text-center">
            <FileCheck className="h-5 w-5 text-brand mx-auto mb-2" />
            <p className="text-xl font-bold">{user.documentsUploaded}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Documents</p>
          </CardContent>
        </Card>
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
            <p className="text-xl font-bold">{new Date(user.lastLoginAt).toLocaleDateString()}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Last Login</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, Badge } from "@urbandetox/ui";
import {
  Users,
  UserCheck,
  UserX,
  FileCheck,
  ArrowRight,
  Search,
} from "lucide-react";
import { getAllUsers, seedDemoUsers, type UserProfile } from "@/lib/users";

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    seedDemoUsers();
    const t = setTimeout(() => {
      setUsers(getAllUsers());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );
  }, [users, search]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isLoggedIn).length;
    const offline = total - active;
    const totalDocs = users.reduce((sum, u) => sum + u.documentsUploaded, 0);
    return { total, active, offline, totalDocs };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage registered customers and their profiles.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="h-10 w-full sm:w-64 pl-9 pr-4 rounded-xl border border-input bg-white text-sm outline-none focus:border-brand/50 transition-colors"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.active}</p>
              <p className="text-xs text-muted-foreground mt-1">Active Now</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <UserX className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.offline}</p>
              <p className="text-xs text-muted-foreground mt-1">Offline</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.totalDocs}</p>
              <p className="text-xs text-muted-foreground mt-1">Documents</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card className="border border-border/40 rounded-2xl bg-white">
          <CardContent className="p-12 text-center">
            <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-bold">No users found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/40 rounded-2xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-secondary/[0.03]">
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Health</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Activity</th>
                  <th className="text-right px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border/20 hover:bg-brand/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-brand">{u.fullName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-xs">{u.fullName}</p>
                          <p className="text-[10px] text-muted-foreground">{u.gender} · {u.bloodGroup}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs">{u.email}</p>
                      <p className="text-[10px] text-muted-foreground">{u.phone}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs">{u.foodPreference}</p>
                      {u.allergies !== "None" && (
                        <p className="text-[10px] text-amber-600">Allergies: {u.allergies}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {u.isLoggedIn ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                          <UserCheck className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px]">
                          <UserX className="h-3 w-3 mr-1" /> Offline
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-medium">{u.bookingsCount} bookings</p>
                      <p className="text-[10px] text-muted-foreground">{u.documentsUploaded} docs</p>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/users/${u.id}`}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand/80 transition-colors"
                      >
                        View <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

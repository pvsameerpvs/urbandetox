"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { fetchUsers, type PaginatedUsersResponse } from "@/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { SimpleStatCard } from "@/components/ui/SimpleStatCard";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { toast } from "sonner";

interface DashboardUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  gender: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  bookingsCount: number;
}

export default function UsersPage() {
  const [response, setResponse] = useState<PaginatedUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers({
        search: search || undefined,
        page,
        pageSize: 25,
        sortBy,
        sortOrder,
      });
      setResponse(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load users";
      toast.error(message);
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [search, page, sortBy, sortOrder]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, [loadUsers]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const users = response?.data ?? [];
  const meta = response?.meta;

  const stats = {
    total: meta?.totalCount ?? 0,
    admins: users.filter((u) => u.role === "admin").length,
    totalBookings: users.reduce((sum, u) => sum + (u.bookingsCount ?? 0), 0),
  };

  const columns = useMemo(
    () => [
      {
        key: "fullName",
        header: "Name",
        sortable: true,
        cell: (u: DashboardUser) => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-brand">
                {u.fullName?.charAt(0) || u.email.charAt(0)}
              </span>
            </div>
            <p className="font-medium text-xs">{u.fullName || "—"}</p>
          </div>
        ),
      },
      {
        key: "email",
        header: "Email",
        sortable: true,
        cell: (u: DashboardUser) => (
          <p className="text-xs text-muted-foreground">{u.email}</p>
        ),
      },
      {
        key: "phone",
        header: "Contact",
        cell: (u: DashboardUser) => (
          <div>
            <p className="text-xs">{u.phone || "—"}</p>
            <p className="text-[10px] text-muted-foreground">{u.gender || "—"}</p>
          </div>
        ),
      },
      {
        key: "role",
        header: "Role",
        cell: (u: DashboardUser) => <RoleBadge role={u.role} />,
      },
      {
        key: "bookingsCount",
        header: "Bookings",
        sortable: true,
        align: "center" as const,
        cell: (u: DashboardUser) => (
          <span className="text-xs font-medium">{u.bookingsCount}</span>
        ),
      },
      {
        key: "createdAt",
        header: "Joined",
        sortable: true,
        cell: (u: DashboardUser) => (
          <span className="text-[10px] text-muted-foreground">
            {new Date(u.createdAt).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: "action",
        header: "",
        align: "right" as const,
        cell: (u: DashboardUser) => (
          <Link
            href={`/users/${u.id}`}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand/80 transition-colors"
          >
            View <ArrowRight className="h-3 w-3" />
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage registered customers and their profiles.
          </p>
        </div>
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search users..."
          className="w-full sm:w-64"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <SimpleStatCard
          value={stats.total}
          label="Total Users"
          icon={<Users className="h-5 w-5 text-brand" />}
          bgClass="bg-brand/10"
        />
        <SimpleStatCard
          value={stats.admins}
          label="Admins"
          icon={<ShieldCheck className="h-5 w-5 text-emerald-700" />}
          bgClass="bg-emerald-100"
        />
        <SimpleStatCard
          value={stats.totalBookings}
          label="Total Bookings"
          icon={<UserCheck className="h-5 w-5 text-amber-700" />}
          bgClass="bg-amber-100"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        isLoading={isLoading}
        sortColumn={sortBy}
        sortDirection={sortBy ? sortOrder : null}
        onSort={handleSort}
        emptyState={{
          icon: <Users className="h-6 w-6 text-muted-foreground" />,
          title: "No users found",
          subtitle: search ? "Try adjusting your search." : "Users will appear here once they sign up.",
        }}
        footer={
          meta ? (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              hasNextPage={meta.hasNextPage}
              hasPrevPage={meta.hasPrevPage}
              onPageChange={setPage}
            />
          ) : null
        }
      />
    </div>
  );
}



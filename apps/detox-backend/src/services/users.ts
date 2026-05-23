import { eq, count, ilike, or, and, desc, asc, inArray } from "drizzle-orm";
import { db } from "@/db";
import { users, bookings } from "@/db/schema";

export interface ListUsersFilters {
  search?: string;
  role?: "admin" | "authenticated";
  sortBy?: "createdAt" | "fullName" | "email";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface UserWithBookingsCount {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  bookingsCount: number;
}

export interface PaginatedUsersResult {
  data: UserWithBookingsCount[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const UserService = {
  async list(filters: ListUsersFilters = {}): Promise<PaginatedUsersResult> {
    const {
      search,
      role,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      pageSize = 25,
    } = filters;

    const safePage = Math.max(1, page);
    const safePageSize = Math.min(100, Math.max(1, pageSize));
    const offset = (safePage - 1) * safePageSize;

    // Build where clause
    const conditions = [];
    if (search) {
      const q = `%${search}%`;
      conditions.push(
        or(
          ilike(users.fullName, q),
          ilike(users.email, q),
          ilike(users.phone, q)
        )
      );
    }
    if (role) {
      conditions.push(eq(users.role, role));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Count total
    const countResult = await db
      .select({ value: count() })
      .from(users)
      .where(whereClause);
    const totalCount = Number(countResult[0]?.value ?? 0);

    // Resolve sort column
    const sortColumn =
      sortBy === "fullName"
        ? users.fullName
        : sortBy === "email"
        ? users.email
        : users.createdAt;

    const orderFn = sortOrder === "asc" ? asc : desc;

    // Fetch paginated users
    const userRows = await db
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(safePageSize)
      .offset(offset);

    // Batch fetch booking counts for returned users
    const userIds = userRows.map((u) => u.id);
    let bookingCounts: Record<string, number> = {};

    if (userIds.length > 0) {
      const countRows = await db
        .select({
          userId: bookings.userId,
          count: count(),
        })
        .from(bookings)
        .where(inArray(bookings.userId, userIds))
        .groupBy(bookings.userId);

      bookingCounts = Object.fromEntries(
        countRows.map((r) => [String(r.userId), Number(r.count)])
      );
    }

    const data: UserWithBookingsCount[] = userRows.map((u) => ({
      ...u,
      bookingsCount: bookingCounts[u.id] ?? 0,
    }));

    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));

    return {
      data,
      meta: {
        page: safePage,
        pageSize: safePageSize,
        totalCount,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
    };
  },

  async getById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return null;

    const countResult = await db
      .select({ value: count() })
      .from(bookings)
      .where(eq(bookings.userId, id));

    return { ...user, bookingsCount: Number(countResult[0]?.value ?? 0) };
  },

  async updateRole(id: string, role: "admin" | "authenticated") {
    const [updated] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  },
} as const;

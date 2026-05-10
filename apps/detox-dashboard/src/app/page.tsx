import { Button } from "@urbandetox/ui";
import { BRAND } from "@urbandetox/utils";

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{BRAND.name} Admin</h1>
        <Button size="sm">Sign Out</Button>
      </header>
      <main className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Packages</h2>
            <p className="text-muted-foreground text-sm">Manage detox packages and itineraries.</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Departures</h2>
            <p className="text-muted-foreground text-sm">Manage trip dates, pricing, and availability.</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Bookings</h2>
            <p className="text-muted-foreground text-sm">View and manage customer bookings.</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Guides</h2>
            <p className="text-muted-foreground text-sm">Manage travel guide articles.</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Users</h2>
            <p className="text-muted-foreground text-sm">Manage user accounts and permissions.</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground text-sm">View booking trends and insights.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

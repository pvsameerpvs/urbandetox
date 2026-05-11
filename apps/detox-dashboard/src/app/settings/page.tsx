"use client";

import { Card, CardContent } from "@urbandetox/ui";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your admin panel preferences.</p>
      </div>

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
            <Settings className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Settings</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">Admin settings will be available here. Connect to Supabase backend to enable full CRUD operations.</p>
        </CardContent>
      </Card>
    </div>
  );
}

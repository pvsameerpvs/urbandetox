import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { SiteSettingsForm } from "../components/SiteSettingsForm";

export const metadata: Metadata = {
  title: "Site Configuration — Urban Detox Admin",
};

export default function SiteSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Settings
        </Link>
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Site Configuration</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Control footer visibility and manage social media links.
            </p>
          </div>
        </div>
      </div>

      <SiteSettingsForm />
    </div>
  );
}

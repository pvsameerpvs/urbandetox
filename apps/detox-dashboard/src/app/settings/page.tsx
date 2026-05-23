import { Card, CardContent } from "@urbandetox/ui";
import { Tag, Palette, Bell, Shield, Database, Globe } from "lucide-react";
import Link from "next/link";

const settingsSections = [
  {
    title: "Seasonal Tags",
    description: "Manage tags for categorizing packages",
    href: "/seasonal-tags",
    icon: Tag,
  },
  {
    title: "Site Configuration",
    description: "Footer visibility and social media links",
    href: "/settings/site",
    icon: Globe,
  },
  {
    title: "Appearance",
    description: "Theme, colors, and branding",
    href: "#",
    icon: Palette,
    disabled: true,
  },
  {
    title: "Notifications",
    description: "Email and push notification settings",
    href: "#",
    icon: Bell,
    disabled: true,
  },
  {
    title: "Security",
    description: "Password, API keys, and access control",
    href: "#",
    icon: Shield,
    disabled: true,
  },
  {
    title: "Database",
    description: "Backup, restore, and data management",
    href: "#",
    icon: Database,
    disabled: true,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your admin panel preferences and manage system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          const CardWrapper = section.disabled ? "div" : Link;
          return (
            <CardWrapper
              key={section.title}
              href={section.href}
              className={
                section.disabled
                  ? "opacity-50 cursor-not-allowed rounded-2xl"
                  : "hover:border-brand/40 hover:bg-brand/[0.02] transition-colors rounded-2xl"
              }
            >
              <Card className="border border-border/40 shadow-sm bg-white rounded-2xl h-full">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="shrink-0 h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{section.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
}

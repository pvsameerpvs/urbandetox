"use client";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}

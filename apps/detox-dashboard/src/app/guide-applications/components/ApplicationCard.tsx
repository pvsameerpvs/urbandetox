"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Trash2 } from "lucide-react";
import { Badge, Button } from "@urbandetox/ui";
import type { GuideApplication } from "@/lib/api";

const STATUSES = ["new", "reviewing", "shortlisted", "rejected", "hired"] as const;

const TONE: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  reviewing: "bg-amber-50 text-amber-700",
  shortlisted: "bg-violet-50 text-violet-700",
  rejected: "bg-red-50 text-red-600",
  hired: "bg-emerald-50 text-emerald-700",
};

interface ApplicationCardProps {
  application: GuideApplication;
  onStatus: (status: string) => void;
  onDelete: () => void;
  busy?: boolean;
}

export function ApplicationCard({ application: a, onStatus, onDelete, busy }: ApplicationCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border/40 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold">{a.fullName}</p>
            <Badge className={`border-0 text-[10px] font-medium ${TONE[a.status] ?? ""}`}>
              {a.status}
            </Badge>
            {a.experienceYears != null && (
              <span className="text-xs text-muted-foreground">{a.experienceYears}y experience</span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {a.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.city}</span>}
            <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
              <Mail className="h-3 w-3" /> {a.email}
            </a>
            <a
              href={`https://wa.me/${a.phone.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <MessageCircle className="h-3 w-3" /> {a.phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={a.status}
            disabled={busy}
            onChange={(e) => onStatus(e.target.value)}
            className="h-9 rounded-xl border border-border bg-white px-2 text-xs outline-none focus:border-brand/50 disabled:opacity-50"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-red-600"
            onClick={onDelete}
            disabled={busy}
            aria-label={`Delete application from ${a.fullName}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {a.destinations.map((d) => (
          <span key={d} className="rounded-full bg-brand-muted px-2.5 py-0.5 text-[11px] font-medium">{d}</span>
        ))}
        {a.languages.map((l) => (
          <span key={l} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-muted-foreground">{l}</span>
        ))}
      </div>

      {a.about && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-semibold text-brand hover:underline"
          >
            {open ? "Hide" : "Read"} application
          </button>
          {open && (
            <p className="mt-2 whitespace-pre-wrap rounded-xl bg-secondary/30 p-3 text-sm text-muted-foreground">
              {a.about}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

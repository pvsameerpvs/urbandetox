"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Link2, Loader2, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, CardContent } from "@urbandetox/ui";
import {
  fetchBookingShareLinkStatus,
  issueBookingShareLink,
  revokeBookingShareLink,
} from "@/lib/api";

interface ShareLinkCardProps {
  bookingId: string;
  customerName: string;
  customerPhone: string;
}

export function ShareLinkCard({ bookingId, customerName, customerPhone }: ShareLinkCardProps) {
  const [status, setStatus] = useState<Awaited<ReturnType<typeof fetchBookingShareLinkStatus>> | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(() => {
    fetchBookingShareLinkStatus(bookingId).then(setStatus).catch(() => setStatus({ active: false }));
  }, [bookingId]);

  useEffect(load, [load]);

  const issue = async () => {
    setBusy(true);
    try {
      const link = await issueBookingShareLink(bookingId);
      setUrl(link.url);
      toast.success("Link created. Copy it now, it cannot be shown again.");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create the link");
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    if (!window.confirm("Revoke the current link? Anyone holding it will lose access.")) return;
    setBusy(true);
    try {
      await revokeBookingShareLink(bookingId);
      setUrl(null);
      toast.success("Link revoked");
      load();
    } catch {
      toast.error("Could not revoke");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waHref = url
    ? `https://wa.me/${customerPhone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
        `Hi ${customerName.split(" ")[0] || ""}, please add your traveller details here: ${url}`
      )}`
    : "#";

  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-1 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-bold">Traveller details link</h3>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Send this so the customer can fill their details without an account. It
          expires in 14 days and only opens this one booking.
        </p>

        {status && (
          <p className="mb-4 text-xs text-muted-foreground">
            {status.active
              ? `Active link, expires ${new Date(status.expiresAt!).toLocaleDateString()} · opened ${status.useCount ?? 0} time(s)`
              : "No active link"}
          </p>
        )}

        {url && (
          <div className="mb-4 rounded-xl bg-secondary/40 p-3">
            <p className="break-all font-mono text-[11px]">{url}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={issue} disabled={busy} className="h-10 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-semibold">
            {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Link2 className="mr-1.5 h-3.5 w-3.5" />}
            {status?.active ? "Create new link" : "Create link"}
          </Button>

          {url && (
            <>
              <Button variant="outline" onClick={copy} className="h-10 rounded-xl text-xs font-medium">
                {copied ? <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" className="h-10 rounded-xl text-xs font-medium" asChild>
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Send on WhatsApp
                </a>
              </Button>
            </>
          )}

          {status?.active && (
            <Button variant="ghost" onClick={revoke} disabled={busy} className="h-10 rounded-xl text-xs font-medium text-muted-foreground hover:text-red-600">
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Revoke
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

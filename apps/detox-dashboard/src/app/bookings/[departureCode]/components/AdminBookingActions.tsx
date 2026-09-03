"use client";

import { useState } from "react";
import { Loader2, ShieldAlert, XCircle, BadgeCheck, Banknote } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Input,
} from "@urbandetox/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cancelBooking, resolveBookingReview, refundPayment } from "@/lib/api";

interface AdminBookingActionsProps {
  bookingId: string;
  bookingStatus: string;
  payment?: {
    razorpayPaymentId: string;
    amountPaise: number;
    amountRefundedPaise: number;
    status: string;
  } | null;
  onChanged: () => void;
}

export function AdminBookingActions({
  bookingId,
  bookingStatus,
  payment,
  onChanged,
}: AdminBookingActionsProps) {
  const [busy, setBusy] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [resultNote, setResultNote] = useState<string>();

  const isActive = ["confirmed", "reserved_cod", "payment_review"].includes(bookingStatus);
  const captured = payment?.status === "captured";
  const remainingPaise = (payment?.amountPaise ?? 0) - (payment?.amountRefundedPaise ?? 0);
  const canRefund = Boolean(payment && captured && remainingPaise > 0);

  const doCancel = async () => {
    setBusy(true);
    try {
      const result = await cancelBooking(bookingId);
      setResultNote(
        result.refundDue
          ? `Refund due per policy: ${result.refundDue.label} (₹${(result.refundDue.amountPaise / 100).toLocaleString("en-IN")}). Use the Refund button to issue it.`
          : result.note || "Booking canceled. Seats released."
      );
      toast.success("Booking canceled");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel booking");
    } finally {
      setBusy(false);
      setCancelOpen(false);
    }
  };

  const doResolveReview = async () => {
    setBusy(true);
    try {
      await resolveBookingReview(bookingId);
      toast.success("Booking confirmed; seats taken");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not confirm booking");
    } finally {
      setBusy(false);
    }
  };

  const doRefund = async () => {
    const amountPaise = Math.round(Number(refundAmount || 0) * 100);
    if (Number.isNaN(amountPaise) || amountPaise < 1) {
      toast.error("Enter a valid refund amount");
      return;
    }
    if (amountPaise > remainingPaise) {
      toast.error(`Amount exceeds the remaining ₹${(remainingPaise / 100).toLocaleString("en-IN")}`);
      return;
    }
    setBusy(true);
    try {
      await refundPayment(payment!.razorpayPaymentId, amountPaise);
      toast.success(`Refund of ₹${(amountPaise / 100).toLocaleString("en-IN")} initiated`);
      setRefundOpen(false);
      setRefundAmount("");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not issue refund");
    } finally {
      setBusy(false);
    }
  };

  if (!isActive && !canRefund) return null;

  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-bold">Admin actions</h3>
        </div>

        {resultNote && (
          <p className="rounded-xl bg-secondary/40 p-3 text-xs text-muted-foreground leading-relaxed">
            {resultNote}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {bookingStatus === "payment_review" && (
            <Button onClick={doResolveReview} disabled={busy} className="h-10 rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-semibold">
              {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <BadgeCheck className="mr-1.5 h-3.5 w-3.5" />}
              Confirm & take seats
            </Button>
          )}

          {canRefund && (
            <Button onClick={() => setRefundOpen(true)} disabled={busy} variant="outline" className="h-10 rounded-xl text-xs font-medium">
              <Banknote className="mr-1.5 h-3.5 w-3.5" />
              Refund ({remainingPaise > 0 ? `₹${(remainingPaise / 100).toLocaleString("en-IN")} left` : "fully refunded"})
            </Button>
          )}

          {isActive && (
            <Button onClick={() => setCancelOpen(true)} disabled={busy} variant="ghost" className="h-10 rounded-xl text-xs font-medium text-red-600 hover:text-red-700">
              <XCircle className="mr-1.5 h-3.5 w-3.5" /> Cancel booking
            </Button>
          )}
        </div>
      </CardContent>

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel this booking?"
        description="The booking is closed and seats are released. No money is moved automatically; issue any refund separately."
        confirmLabel="Cancel booking"
        onConfirm={doCancel}
        onCancel={() => setCancelOpen(false)}
      />

      <Dialog open={refundOpen} onOpenChange={(v: boolean) => { if (!v) setRefundOpen(false); }}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
          <div className="p-6 pb-4 space-y-2">
            <DialogTitle className="text-base font-semibold">Issue refund</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Full remaining amount is {`₹${(remainingPaise / 100).toLocaleString("en-IN")}`}. Enter the amount to refund to the customer.
            </DialogDescription>
            <Input
              type="number"
              min={1}
              max={Math.max(1, remainingPaise / 100)}
              step="1"
              placeholder="Amount in ₹"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/40 border-t">
            <Button type="button" variant="outline" className="rounded-xl h-9 text-sm px-5" onClick={() => setRefundOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={doRefund} disabled={busy} className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-9 text-sm px-5">
              {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Refund
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
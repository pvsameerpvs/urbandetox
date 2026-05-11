"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@urbandetox/ui";
import { Button } from "@urbandetox/ui";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onCancel(); }}>
      <DialogContent showCloseButton={false} className="sm:max-w-[400px] p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="space-y-1.5">
              <DialogTitle className="text-base font-semibold text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/40 border-t">
          <Button type="button" variant="outline" className="rounded-xl h-9 text-sm px-5" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" className="rounded-xl bg-red-500 text-white hover:bg-red-600 h-9 text-sm px-5" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

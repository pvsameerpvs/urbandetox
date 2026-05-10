import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

interface OnboardingSubmittedProps {
  isVisible: boolean;
}

export function OnboardingSubmitted({ isVisible }: OnboardingSubmittedProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <Check className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">All Set!</h3>
              <p className="text-muted-foreground mb-2">Your details have been saved.</p>
              <p className="text-sm text-muted-foreground">Redirecting to confirmation...</p>
              <Loader2 className="h-5 w-5 text-brand mx-auto mt-4 animate-spin" />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

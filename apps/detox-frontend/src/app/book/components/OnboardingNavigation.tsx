;
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "@urbandetox/ui"

interface OnboardingNavigationProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function OnboardingNavigation({
  step,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
}: OnboardingNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-border/40">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={step === 1 || isSubmitting}
        className="rounded-xl h-11 px-5 text-sm font-medium border-border/60"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Back
      </Button>
      {step < totalSteps ? (
        <Button
          className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10"
          onClick={onNext}
        >
          Next Step <ChevronRight className="ml-1.5 h-4 w-4" />
        </Button>
      ) : (
        <Button
          className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" /> Confirm & Submit
            </>
          )}
        </Button>
      )}
    </div>
  );
}

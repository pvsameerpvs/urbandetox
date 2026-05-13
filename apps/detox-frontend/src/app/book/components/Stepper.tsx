"use client";
import { motion } from "framer-motion";
import { cn } from "@urbandetox/utils";
;
import { Check, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui"

interface Step {
  id: number;
  label: string;
  icon: LucideIcon;
  desc: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
      <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => {
              const isActive = currentStep === s.id;
              const isCompleted = currentStep > s.id;
              return (
                <div key={s.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 shrink-0",
                        isCompleted
                          ? "bg-brand text-brand-foreground shadow-md shadow-brand/20"
                          : isActive
                          ? "bg-brand/10 text-brand ring-2 ring-brand ring-offset-2"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                    </div>
                    <span className={cn(
                      "mt-2 text-[10px] font-bold uppercase tracking-wider hidden sm:block",
                      isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mx-2 sm:mx-4 h-0.5 flex-1 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-brand rounded-full"
                        initial={false}
                        animate={{ width: currentStep > s.id ? "100%" : "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-1 text-center">
            <p className="text-xs text-muted-foreground">
              Step {currentStep} of {steps.length} ·{" "}
              <span className="font-semibold text-foreground">{steps[currentStep - 1]?.label}</span>
              <span className="hidden sm:inline"> — {steps[currentStep - 1]?.desc}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

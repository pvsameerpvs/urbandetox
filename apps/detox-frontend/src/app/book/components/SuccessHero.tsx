import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SuccessHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 ring-4 ring-brand/10">
        <CheckCircle className="h-10 w-10 text-brand" />
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
        Thank <span className="text-brand">You</span>
      </h1>
      <p className="text-base text-muted-foreground max-w-md mx-auto">
        Your detox is confirmed. We have sent a summary to your phone and email.
      </p>
    </motion.div>
  );
}

export function SuccessActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-wrap items-center justify-center gap-3"
    >
      <Button
        className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-12 px-7 text-sm font-semibold shadow-lg shadow-brand/10"
        asChild
      >
        <Link href="/my-detox">
          Go to My Detox <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="outline"
        className="rounded-xl border-border/60 h-12 px-7 text-sm font-medium"
        asChild
      >
        <Link href="/detox">Explore More Detox</Link>
      </Button>
      <Button
        variant="outline"
        className="rounded-xl border-green-200 text-green-600 hover:bg-green-50 h-12 px-7 text-sm font-medium"
        asChild
      >
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us
        </a>
      </Button>
    </motion.div>
  );
}

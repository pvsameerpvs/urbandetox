"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LoginHero() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between overflow-hidden">
      <Image src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop" alt="Adventure background" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      <div className="relative z-10 p-8 xl:p-12">
        <Link href="/" className="inline-block">
          <Image src="/log-detox-white.png" alt="Urban Detox" width={160} height={48} className="h-12 w-auto object-contain" priority />
        </Link>
      </div>

      <div className="relative z-10 p-8 xl:p-12 max-w-lg">
        <blockquote className="text-xl xl:text-2xl font-bold text-white leading-relaxed mb-6">
          "Disconnect from routine. Step into your next detox."
        </blockquote>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Urban Detox Team</p>
            <p className="text-xs text-white/60">Offbeat escapes since 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
}

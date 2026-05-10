"use client";

import Image from "next/image";
import Link from "next/link";
import { LoginHero } from "./components/LoginHero";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <LoginHero />
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-white relative">
        <div className="lg:hidden w-full max-w-sm mb-8">
          <Link href="/" className="inline-block">
            <Image src="/log-detox.png" alt="Urban Detox" width={140} height={40} className="h-10 w-auto object-contain" priority />
          </Link>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

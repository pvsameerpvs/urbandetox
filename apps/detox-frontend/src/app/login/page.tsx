
import Image from "next/image";
import Link from "next/link";
import { LoginHero } from "./components/LoginHero";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <main className="h-[100dvh] flex flex-col lg:flex-row bg-white overflow-hidden">
      <LoginHero />

      {/* Mobile hero */}
      <div className="lg:hidden relative h-40 shrink-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop"
          alt="Mountain retreat"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar-dark/50 via-sidebar-dark/20 to-sidebar-dark/70" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
          <Link href="/" className="inline-block">
            <Image src="/log-detox-white.png" alt="Urban Detox" width={120} height={36} className="h-8 w-auto object-contain" priority />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-5 sm:px-8 lg:px-10 overflow-y-auto lg:overflow-hidden">
        <LoginForm />
      </div>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { fetchTestimonials } from "@/lib/api";
import { LOGIN_IMAGE } from "./login-image";
import { LoginHero } from "./components/LoginHero";
import { LoginForm } from "./components/LoginForm";

/** Static page, so refresh the quotes hourly instead of freezing them at build. */
export const revalidate = 3600;

export const metadata = {
  title: "Sign in | Urban Detox",
  description: "Sign in to manage your Urban Detox bookings and traveller details.",
};

export default async function LoginPage() {
  // Real reviews, fetched server side. If the API is down the hero simply drops
  // the quotes block rather than falling back to invented ones.
  const testimonials = await fetchTestimonials(2).catch(() => []);

  return (
    <main className="min-h-[100dvh] flex flex-col lg:flex-row bg-white">
      <LoginHero testimonials={testimonials} />

      {/* Mobile band: same photo, just cropped short. */}
      <div className="lg:hidden relative h-36 shrink-0 overflow-hidden">
        <Image src={LOGIN_IMAGE} alt="Travellers at a viewpoint in Kodaikanal" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar-dark/40 via-sidebar-dark/25 to-sidebar-dark/75" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link href="/" className="inline-block">
            <Image src="/log-detox-white.png" alt="Urban Detox" width={120} height={36} className="h-9 w-auto object-contain" priority />
          </Link>
        </div>
      </div>

      {/*
        Scrolls rather than clips. This used to be h-[100dvh] with
        overflow-hidden, which cut the bottom off the signup form on any
        viewport shorter than about 700px, taking the submit button with it.
      */}
      <div className="flex-1 flex flex-col justify-center items-center px-5 py-10 sm:px-8 lg:px-10">
        <LoginForm />
      </div>
    </main>
  );
}

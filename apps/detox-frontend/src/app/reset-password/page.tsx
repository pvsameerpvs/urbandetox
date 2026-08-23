import Image from "next/image";
import Link from "next/link";
import { ResetPasswordForm } from "./components/ResetPasswordForm";

export const metadata = {
  title: "Set a new password | Urban Detox",
  robots: { index: false, follow: false },
};

/** Where Supabase's recovery email lands. Without this the reset link 404s. */
export default function ResetPasswordPage() {
  return (
    <main className="min-h-[100dvh] bg-white flex flex-col items-center justify-center px-5 py-12">
      <Link href="/" className="mb-8 inline-block">
        <Image src="/log-detox.png" alt="Urban Detox" width={140} height={42} className="h-10 w-auto object-contain" priority />
      </Link>
      <ResetPasswordForm />
    </main>
  );
}

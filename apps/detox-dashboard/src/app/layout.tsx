import type { Metadata } from "next";
import { Red_Hat_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminShell } from "@/components/layout/AdminShell";
import { Toaster } from "sonner";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Urban Detox Admin",
  description: "Admin dashboard for Urban Detox",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${redHatDisplay.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <AdminShell>{children}</AdminShell>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urban Detox — Disconnect from routine. Step into your next detox.",
  description:
    "Curated offbeat escapes for real reset. Small-group detox trips to Kodaikanal, North Kerala, Gokarna, and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClientProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}

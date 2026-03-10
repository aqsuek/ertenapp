import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { OfflineBanner } from "@/components/OfflineBanner";
import { PwaRegister } from "./PwaRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ErtenApp",
  description:
    "Ертеңгі жоспарлар мен оқиғаларға арналған кинематографиялық жоспарлаушы",
  manifest: "/manifest.webmanifest",
  icons: [
    { rel: "icon", url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
    { rel: "icon", url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    {
      rel: "apple-touch-icon",
      url: "/icons/icon-192.svg",
      sizes: "192x192",
      type: "image/svg+xml",
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk" className="bg-white">
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-slate-900 min-h-dvh`}
      >
        <OfflineBanner />
        <PwaRegister />
        <main className="pb-20 min-h-dvh">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

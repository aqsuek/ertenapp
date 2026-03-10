import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { OfflineBanner } from "@/components/OfflineBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ErtenApp",
  description: "Ертеңгі жоспарлар мен оқиғаларға арналған кинематографиялық жоспарлаушы",
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
        <main className="pb-20 min-h-dvh">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

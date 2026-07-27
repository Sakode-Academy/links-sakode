import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sakode Academy - Official Links Hub & Community",
  description: "Tautan resmi Sakode Academy: WhatsApp Pendaftaran, Instagram, TikTok, Website Portal Official, & Contact Email. Komunitas Belajar Koding Papua.",
  keywords: ["Sakode Academy", "Sakode Papua", "Belajar Koding Papua", "Sakode Links", "Linktree Sakode", "Bootcamp Web Development"],
  openGraph: {
    title: "Sakode Academy - Official Links Hub",
    description: "Hubungkan diri Anda dengan Sakode Academy via WhatsApp, Instagram, TikTok, Email & Portal Website.",
    siteName: "Sakode Academy",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}

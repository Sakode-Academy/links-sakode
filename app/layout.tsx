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
  title: "Sakode Academy - Official Links",
  description: "Tautan resmi Sakode Academy (link.sakode.com): WhatsApp Pendaftaran, Instagram, TikTok, Website Portal Official, & Contact Email.",
  keywords: ["Sakode Academy", "Sakode Papua", "Belajar Koding Papua", "Sakode Links", "Linktree Sakode", "Bootcamp Web Development"],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
        {children}
      </body>
    </html>
  );
}

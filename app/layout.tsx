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
  metadataBase: new URL("https://link.sakode.com"),
  title: {
    default: "Sakode Academy - Official Links",
    template: "%s | Sakode Academy",
  },
  description: "Tautan resmi Sakode Academy (link.sakode.com): WhatsApp Pendaftaran, Instagram, TikTok, Website Portal Official, & Contact Email. Komunitas & Akademi Belajar Koding Samarang, Garut, Jawa Barat.",
  keywords: [
    "Sakode Academy",
    "Sakode Garut",
    "Sakode Samarang",
    "Belajar Koding Garut",
    "Sakode Links",
    "Linktree Sakode",
    "Official Links Sakode",
    "Bootcamp Web Development Garut",
    "Komunitas Developer Garut",
    "link.sakode.com"
  ],
  authors: [{ name: "Sakode Academy Team", url: "https://link.sakode.com" }],
  creator: "Sakode Academy",
  publisher: "Sakode Academy",
  alternates: {
    canonical: "https://link.sakode.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Sakode Academy - Official Links Hub",
    description: "Tautan resmi Sakode Academy Samarang Garut: WhatsApp Pendaftaran, Instagram, TikTok, Website Portal Official, & Contact Email.",
    url: "https://link.sakode.com",
    siteName: "Sakode Academy",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sakode Academy Official Links Hub",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sakode Academy - Official Links",
    description: "Tautan resmi Sakode Academy Samarang Garut: WhatsApp Pendaftaran, Instagram, TikTok, Website Portal Official, & Contact Email.",
    images: ["/opengraph-image"],
    creator: "@sakodeacademy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Sakode Academy",
    "url": "https://link.sakode.com",
    "logo": "https://link.sakode.com/icon.svg",
    "sameAs": [
      "https://www.instagram.com/sakodeacademy",
      "https://vm.tiktok.com/ZS9r7LeLjdhWX-yvCBH/",
      "https://wa.me/message/UTMRQNH4ERNBM1"
    ],
    "description": "Akademi & Komunitas Teknologi Samarang, Garut, Jawa Barat. Belajar Koding, Fullstack Web Development & Inovasi Digital.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Samarang",
      "addressRegion": "Garut, Jawa Barat",
      "addressCountry": "ID"
    }
  };

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body 
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950"
      >
        {children}
      </body>
    </html>
  );
}

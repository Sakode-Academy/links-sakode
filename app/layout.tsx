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

const siteUrl = "https://link.sakode.com";
const titleText = "Sakode Academy • Masa Depan Digital, Dimulai Dari Sini";
const descText = "Tautan resmi Sakode Academy: WhatsApp Pendaftaran, Instagram, TikTok, Website Portal Official, & Contact Email.";
const ogImageUrl = `${siteUrl}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: titleText,
    template: "%s | Sakode Academy",
  },
  description: descText,
  keywords: [
    "Sakode Academy",
    "Masa Depan Digital Dimulai Dari Sini",
    "Sakode Garut",
    "Sakode Samarang",
    "Belajar Koding Garut",
    "Sakode Links",
    "Linktree Sakode",
    "Official Links Sakode",
    "Bootcamp Web Development",
    "link.sakode.com"
  ],
  authors: [{ name: "Sakode Academy Team", url: siteUrl }],
  creator: "Sakode Academy",
  publisher: "Sakode Academy",
  alternates: {
    canonical: siteUrl,
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
    title: titleText,
    description: descText,
    url: siteUrl,
    siteName: "Sakode Academy",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: titleText,
        type: "image/png",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: titleText,
    description: descText,
    images: [ogImageUrl],
    creator: "@sakodeacademy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Sakode Academy",
    "slogan": "Masa Depan Digital, Dimulai Dari Sini",
    "url": siteUrl,
    "logo": `${siteUrl}/icon.svg`,
    "sameAs": [
      "https://www.instagram.com/sakodeacademy",
      "https://vm.tiktok.com/ZS9r7LeLjdhWX-yvCBH/",
      "https://wa.me/message/UTMRQNH4ERNBM1"
    ],
    "description": descText,
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
        {/* Explicit OpenGraph & WhatsApp Crawler Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={titleText} />
        <meta property="og:description" content={descText} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Sakode Academy" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={titleText} />
        <meta name="twitter:description" content={descText} />
        <meta name="twitter:image" content={ogImageUrl} />

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

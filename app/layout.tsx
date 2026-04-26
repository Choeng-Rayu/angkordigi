import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidgetWrapper from "@/app/components/layout/ChatWidgetWrapper";
import { Navbar } from "@/app/components/layout/Navbar";
import { CustomCursor } from "@/app/components/effects/CustomCursor";
import { ScrollProgress } from "@/app/components/effects/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site URL constant for consistent URL usage
const SITE_URL = "https://tomnerb.com";

export const metadata: Metadata = {
  title: "TomNerb Digital Solutions | Cambodia's Startup Tech Team",
  description: "Cambodia's startup tech team. We build digital products, automate business workflows, and deliver AI/ML solutions for SMEs.",
  keywords: ["digital solutions", "Cambodia", "SMEs", "automation", "software development", "TomNerb", "AI/ML solutions", "business workflows"],
  authors: [{ name: "TomNerb Digital Solutions" }],
  creator: "TomNerb Digital Solutions",
  publisher: "TomNerb Digital Solutions",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "TomNerb Digital Solutions | Cambodia's Startup Tech Team",
    description: "Cambodia's startup tech team. We build digital products, automate business workflows, and deliver AI/ML solutions for SMEs.",
    url: SITE_URL,
    siteName: "TomNerb Digital Solutions",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "TomNerb Digital Solutions - Cambodia's Startup Tech Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TomNerb Digital Solutions | Cambodia's Startup Tech Team",
    description: "Cambodia's startup tech team. We build digital products, automate business workflows, and deliver AI/ML solutions for SMEs.",
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@tomnerb",
    site: "@tomnerb",
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    yandex: "YOUR_YANDEX_VERIFICATION_CODE",
    yahoo: "YOUR_YAHOO_VERIFICATION_CODE",
    other: {
      me: ["YOUR_OTHER_VERIFICATION_CODE"],
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#060810",
  width: "device-width",
  initialScale: 1,
};

// Organization structured data (JSON-LD)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TomNerb Digital Solutions",
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "description": "Cambodia's startup tech team. We build digital products, automate business workflows, and deliver AI/ML solutions for SMEs.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Phnom Penh",
    "addressCountry": "KH",
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+855-XXX-XXX-XXX",
    "email": "contact@tomnerb.com",
    "contactType": "customer service",
    "areaServed": "KH",
    "availableLanguage": ["English", "Khmer"],
  },
  "sameAs": [
    "https://facebook.com/tomnerb",
    "https://linkedin.com/company/tomnerb",
    "https://twitter.com/tomnerb",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        <ScrollProgress />
        <Navbar />
        {children}
        <ChatWidgetWrapper />
      </body>
    </html>
  );
}

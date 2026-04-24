import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/app/components/layout/ChatWidget";
import { Navbar } from "@/app/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TomNerb Digital Solutions | Cambodia's Startup Tech Team",
  description: "Cambodia's startup tech team. We build digital products, automate business workflows, and deliver AI/ML solutions for SMEs.",
  keywords: ["digital solutions", "Cambodia", "SMEs", "automation", "software development", "TomNerb"],
  authors: [{ name: "TomNerb Digital Solutions" }],
  openGraph: {
    title: "TomNerb Digital Solutions",
    description: "Cambodia's startup tech team. We build digital products, automate business workflows, and deliver AI/ML solutions for SMEs.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#060810",
  width: "device-width",
  initialScale: 1,
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
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

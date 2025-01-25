import { Metadata, Viewport } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Polaroid Maker",
  description:
    "Share your moments with the world - Create beautiful polaroid-style photos and share your memories instantly",
  keywords: [
    "photos",
    "social",
    "sharing",
    "moments",
    "polaroid",
    "photo editor",
    "image filters",
    "photo frames",
    "instant photos",
  ],
  authors: [{ name: "Tanmay" }],
  robots: "index, follow",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://polaroid-maker.vercel.app",
    title: "Polaroid Maker - Create & Share Beautiful Memories",
    description:
      "Transform your photos into stunning polaroid-style images. Easy to use, instant sharing, and beautiful results.",
    siteName: "Polaroid Maker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Polaroid Maker Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Polaroid Maker - Create & Share Beautiful Memories",
    description: "Transform your photos into stunning polaroid-style images",
    images: ["/og-image.png"],
    creator: "@tanmay7_",
  },
  alternates: {
    canonical: "https://polaroid-maker.vercel.app",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased overflow-hidden`}>{children}</body>
    </html>
  );
}

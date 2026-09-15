import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { CrispWidget } from "@/components/crisp";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nuit Calme — Repare ton sommeil",
  description:
    "Identifie la cause de ton mauvais sommeil et repare-le avec un plan personnalise et un rituel du soir guide.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nuit Calme",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    title: "Tu dors mal. On sait pourquoi.",
    description:
      "Diagnostic en 2 min + plan de 4 semaines + rituel du soir personnalise. Repare ton sommeil.",
    url: "https://nuit-calme.vercel.app",
    siteName: "Nuit Calme",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nuit Calme — Repare ton sommeil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu dors mal. On sait pourquoi.",
    description:
      "Diagnostic en 2 min + plan personnalise. Repare ton sommeil naturellement.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a20",
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
    <html lang="fr" className={`${dmSans.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col font-sans">
        {children}
        <ServiceWorkerRegister />
        <CrispWidget />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nuit Calme — Repare ton sommeil",
  description:
    "Le service qui repare ton sommeil detruit par ton telephone. Diagnostic gratuit, plan personnalise, rituel du soir guide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${dmSans.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col font-sans">{children}</body>
    </html>
  );
}

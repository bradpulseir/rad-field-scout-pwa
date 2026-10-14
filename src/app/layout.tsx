import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BRAND_CONFIG } from "@/config/brandConfig";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: BRAND_CONFIG.brandTitle,
  description: "An Official Shareholder & Community Initiative by Artificial Intelligence Technology Solutions, Inc. (OTC: AITX) and Robotic Assistance Devices (RAD).",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AITX Scout",
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeRoute Dhaka — Safe, Smart Travel for Every Dhaka Family",
  description:
    "SafeRoute Dhaka reduces travel risk and cost for 22 million Dhaka residents by providing real-time, locally-intelligent route recommendations. Built for mothers, budget travellers, and students.",
  keywords: [
    "Dhaka traffic",
    "safe route",
    "school route safety",
    "Dhaka travel",
    "Bangladesh traffic",
    "hartal alert",
    "flood road Dhaka",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

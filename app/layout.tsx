import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Safe Dhaka — AI-Powered Travel Safety for Every Dhaka Family",
  description:
    "Safe Dhaka helps 22 million Dhaka residents travel safely and affordably. Real-time route recommendations with flood alerts, hartal detection, school route safety scores, and budget routing. Built for Dhaka's reality.",
  keywords: [
    "Dhaka traffic",
    "safe route Dhaka",
    "school route safety Bangladesh",
    "hartal alert",
    "flood road Dhaka",
    "Dhaka travel guide",
    "Bangladesh AI assistant",
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

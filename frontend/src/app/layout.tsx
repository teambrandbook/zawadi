import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

import Providers from "./providers"; // 👈 ADD THIS

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zewadi | The Way of Living",
  description: "Building a Healthier Society, Together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        <Providers> {/* 👈 ADD THIS */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
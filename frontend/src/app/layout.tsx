import type { Metadata } from "next";
import { Inter, Oswald, Voltaire, Mulish, Bodoni_Moda, Playfair_Display } from "next/font/google";
import "./globals.css";

import Providers from "./providers"; // 👈 ADD THIS

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-boldonse",
  subsets: ["latin"],
});

const voltaire = Voltaire({
  weight: "400",
  variable: "--font-voltaire",
  subsets: ["latin"],
});

const mulish = Mulish({
  variable: "--font-mulish",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Boldonse&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${oswald.variable} ${bodoniModa.variable} ${voltaire.variable} ${mulish.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
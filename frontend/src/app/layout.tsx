import type { Metadata } from "next";
import { Inter, Oswald, Voltaire, Mulish, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/StoreProvider";

const inter = Inter({
  variable: "--font-inter",
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
        <link href="https://fonts.googleapis.com/css2?family=Boldonse&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${oswald.variable} ${bodoniModa.variable} ${voltaire.variable} ${mulish.variable} antialiased`}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

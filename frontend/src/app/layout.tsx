import type { Metadata } from "next";
import { Inter, Playfair_Display, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/AppWrapper"; // ✅ ADD THIS

const inter = Inter({
  variable: "--inter-font",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--dm-font",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--playfair-font",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const caveat = Caveat({
  variable: "--caveat-font",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Zewadi | Premium Digital Experience",
  description: "Modern, high-performance website built with Next.js and GSAP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${dmSans.variable} ${playfair.variable} ${caveat.variable}`}
    >
      <body className="antialiased font-sans">

        {/* ✅ WRAP EVERYTHING */}
        <AppWrapper>
          <main>{children}</main>
        </AppWrapper>

      </body>
    </html>
  );
}

"use client";

import { useEffect, useState } from "react";
import Providers from "@/app/providers";
import Preloader from "./Preloader";

// Only block on above-the-fold assets — logo and hero images visible on first render.
// All other images and videos load lazily after the page is shown.
const criticalImages = [
  "/logo/zewadi-logo.webp",
  "/home/heroBg.webm",
];

const MAX_WAIT_MS = 3000;

export default function AppWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let done = false;
    let count = 0;
    const total = criticalImages.length;

    const finish = () => {
      if (done) return;
      done = true;
      setLoading(false);
    };

    // Hard timeout so a slow connection never blocks forever
    const timer = setTimeout(finish, MAX_WAIT_MS);

    if (total === 0) {
      finish();
      return () => clearTimeout(timer);
    }

    const markLoaded = () => {
      count++;
      if (count >= total) finish();
    };

    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = markLoaded;
    });

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return <Providers>{children}</Providers>;
}

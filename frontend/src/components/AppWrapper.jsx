"use client";

import { useEffect, useRef, useState } from "react";
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

  return (
    <Providers>
      {children}
      <FloatingScrollbar />
    </Providers>
  );
}

function FloatingScrollbar() {
  const trackRef = useRef(null);
  const dragStartRef = useRef({
    pointerY: 0,
    thumbTop: 0,
  });
  const [scrollState, setScrollState] = useState({
    visible: false,
    thumbHeight: 36,
    thumbTop: 0,
  });

  useEffect(() => {
    const trackHeight = 170;

    const updateScrollbar = () => {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = scrollHeight - viewportHeight;

      if (maxScroll <= 0) {
        setScrollState((current) => ({ ...current, visible: false }));
        return;
      }

      const thumbHeight = Math.max(
        34,
        Math.round((viewportHeight / scrollHeight) * trackHeight)
      );
      const progress = window.scrollY / maxScroll;
      const thumbTop = Math.round((trackHeight - thumbHeight) * progress);

      setScrollState({ visible: true, thumbHeight, thumbTop });
    };

    updateScrollbar();
    window.addEventListener("scroll", updateScrollbar, { passive: true });
    window.addEventListener("resize", updateScrollbar);

    return () => {
      window.removeEventListener("scroll", updateScrollbar);
      window.removeEventListener("resize", updateScrollbar);
    };
  }, []);

  if (!scrollState.visible) return null;

  const scrollToThumbPosition = (thumbTop) => {
    const doc = document.documentElement;
    const trackHeight = trackRef.current?.clientHeight || 170;
    const maxThumbTop = trackHeight - scrollState.thumbHeight;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const clampedThumbTop = Math.min(Math.max(thumbTop, 0), maxThumbTop);
    const progress = maxThumbTop === 0 ? 0 : clampedThumbTop / maxThumbTop;

    window.scrollTo({
      top: progress * maxScroll,
      behavior: "auto",
    });
  };

  const handleTrackPointerDown = (event) => {
    if (!trackRef.current || event.target !== trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const nextThumbTop =
      event.clientY - rect.top - scrollState.thumbHeight / 2;

    scrollToThumbPosition(nextThumbTop);
  };

  const handleThumbPointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragStartRef.current = {
      pointerY: event.clientY,
      thumbTop: scrollState.thumbTop,
    };
  };

  const handleThumbPointerMove = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    const pointerDelta = event.clientY - dragStartRef.current.pointerY;
    const nextThumbTop = dragStartRef.current.thumbTop + pointerDelta;

    scrollToThumbPosition(nextThumbTop);
  };

  return (
    <div
      ref={trackRef}
      aria-label="Page scroll"
      role="scrollbar"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(
        (scrollState.thumbTop /
          Math.max(1, 170 - scrollState.thumbHeight)) *
          100
      )}
      onPointerDown={handleTrackPointerDown}
      className="fixed right-6 top-1/2 z-[1200] hidden h-[170px] w-[10px] -translate-y-1/2 cursor-pointer rounded-full bg-[#E9E4D8]/90 shadow-[0_8px_22px_rgba(15,47,34,0.14)] md:block"
    >
      <div
        onPointerDown={handleThumbPointerDown}
        onPointerMove={handleThumbPointerMove}
        className="absolute left-1/2 w-[6px] -translate-x-1/2 cursor-grab touch-none rounded-full bg-[#1A4331] shadow-[0_4px_12px_rgba(26,67,49,0.32)] active:cursor-grabbing"
        style={{
          height: `${scrollState.thumbHeight}px`,
          top: `${scrollState.thumbTop}px`,
        }}
      />
    </div>
  );
}

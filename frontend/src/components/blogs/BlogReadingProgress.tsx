"use client";

import { useEffect, useState } from "react";

type BlogReadingProgressProps = {
  targetId: string;
  segments?: number;
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export default function BlogReadingProgress({
  targetId,
  segments = 6,
}: BlogReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    setProgress(0);

    const updateProgress = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const targetHeight = target.scrollHeight || target.offsetHeight;
      const targetBottom = targetTop + targetHeight;
      const documentMaxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const start = Math.max(0, targetTop - 96);
      const end = Math.min(
        documentMaxScroll,
        Math.max(start + 1, targetBottom - window.innerHeight + 96)
      );
      const currentProgress = (window.scrollY - start) / Math.max(1, end - start);

      setProgress((previousProgress) => Math.max(previousProgress, clamp(currentProgress)));
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [targetId]);

  return (
    <div
      className="mb-4 flex w-full gap-[4px]"
      aria-label="Blog reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      role="progressbar"
    >
      {Array.from({ length: segments }).map((_, index) => {
        const segmentProgress = clamp(progress * segments - index);

        return (
          <div key={index} className="h-[3px] flex-1 overflow-hidden bg-[#d8d6d1]">
            <div
              className="h-full origin-left bg-[#1f4d3a] transition-transform duration-150 ease-out"
              style={{ transform: `scaleX(${segmentProgress})` }}
            />
          </div>
        );
      })}
    </div>
  );
}

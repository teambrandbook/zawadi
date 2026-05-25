"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  src?: string;
  name: string;
  size: number;
  className?: string;
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "C";
}

export default function MessageClientAvatar({ src, name, size, className = "" }: Props) {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [src]);

  return (
    <div className={`flex items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB] font-semibold text-[#0A4833] ${className}`}>
      {src && !hasImageError ? (
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        initials(name)
      )}
    </div>
  );
}

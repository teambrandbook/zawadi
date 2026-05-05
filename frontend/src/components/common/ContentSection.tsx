import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type ContentSectionProps = {
  title: string;
  subtitle: string;
  sectionClassName?: string;
  containerClassName?: string;
  spacerClassName?: string;
  cardClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

const ContentSection = ({
  title,
  subtitle,
  sectionClassName,
  containerClassName,
  spacerClassName,
  cardClassName,
  titleClassName,
  subtitleClassName,
}: ContentSectionProps) => {
  return (
    <section className={cn("relative overflow-hidden bg-[#1f4d3a] pt-20 pb-0 sm:pt-24", sectionClassName)}>
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <Image
          src="/Patterns-03.webp"
          alt=""
          fill
          className="object-cover object-center"
        />
      </div>

      <div className={cn("relative z-10 container mx-auto px-4 sm:px-40", containerClassName)}>
        <div className={cn("h-[140px] sm:h-[180px]", spacerClassName)} />

        <div
          className={cn(
            "relative -mb-px max-w-[440px] rounded-t-[24px] bg-white px-7 py-7 sm:px-10 sm:py-10",
            cardClassName
          )}
        >
          <h1
            className={cn(
              "font-serif text-[2.25rem] font-bold leading-none text-[#0e2207] sm:text-[2.75rem]",
              titleClassName
            )}
          >
            {title}
          </h1>

          <p
            className={cn(
              "mt-4 text-base font-bold text-[#1f6306] sm:text-lg",
              subtitleClassName
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;

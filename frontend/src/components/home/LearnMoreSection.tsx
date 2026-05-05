import React from 'react';
import Image from 'next/image';
import Link from "next/link";

const LearnMoreSection = () => {
  return (
    <section className="relative w-full">
      {/* 1. Green Section */}
      <div className="relative bg-[#244d3a] w-full pt-16 lg:pt-24 lg:pl-30 pb-0">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <Image
            src="/Patterns-03.webp"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-20 relative flex flex-col lg:flex-row items-center">

          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start z-10 mb-10 lg:mb-24">
            <h2 className="fade-in text-[#d9c5a7] text-4xl lg:text-[54px] font-bold font-['Playfair_Display'] leading-[1.1] mb-6 tracking-tight">
              LEARN MORE<br />
              ABOUT ZEWADI
            </h2>

            <p className="fade-in text-white/90 text-sm lg:text-[16px] font-normal font-['Inter'] leading-relaxed mb-10 max-w-[440px]">
              Zewadi is deeper than what you see on the surface. Get to know the thinking, the purpose, and the story behind it all.
            </p>

            <Link
              href="/about"
              className="bg-[#b47800] text-white rounded-full pl-7 pr-2 py-2 flex items-center gap-5 hover:bg-[#a36d00] transition-all group shadow-lg"
            >
              <span className="font-bold text-[14px] font-['Inter']">Explore More</span>
              <div className="w-9 h-9 rounded-full bg-[#244d3a] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </div>

          {/* Right Content - The Image Stack */}
          <div className="w-full lg:w-1/2 relative z-20">
            {/* This wrapper holds both the image and the badge. 
                The -mb classes stay here to handle the section overlap.
            */}
            <div className="relative w-full h-[250px] lg:h-[420px] -mb-[125px] lg:-mb-[210px]">

              {/* IMAGE CONTAINER: This has overflow-hidden to clip the image corners */}
              <div className="relative w-full h-full rounded-[35px] lg:rounded-[50px] overflow-hidden shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/home/learnMoreBg.webm" type="video/webm" />
                </video>
              </div>

              {/* BADGE: Moved OUTSIDE the overflow-hidden div so it can hang over the edge */}
              <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 lg:-top-10 lg:-left-10 w-16 h-16 md:w-20 md:h-20 lg:w-[130px] lg:h-[130px] bg-[#3a6351] rounded-full flex flex-col items-center justify-center shadow-2xl z-30 text-white border-2 border-white/20">
                <span className="text-lg lg:text-[36px] font-bold font-['Inter'] leading-none">30%</span>
                <span className="text-[7px] lg:text-[12px] font-medium opacity-90 mt-0.5 uppercase tracking-widest text-center">
                  Discounts
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 2. White Spacer */}
      <div className="h-[180px] lg:h-[300px] bg-white w-full" />
    </section>
  );
};

export default LearnMoreSection;

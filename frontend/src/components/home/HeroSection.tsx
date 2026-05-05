"use client"


import Image from 'next/image';
import React, { useEffect, useState } from "react";
import Link from "next/link";



const images = [
  "/home/a1.webp",
  "/home/a2.webp",
  "/home/a3.webp",
];

const HeroSection = () => {

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000); // change every 2 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative w-full min-h-screen lg:h-screen flex items-center overflow-hidden bg-[#0e2207]">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image
            src="/Patterns-03.webp"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/home/heroBg.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-6 lg:px-32 xl:px-40 relative z-10 flex flex-col-reverse lg:flex-row items-center lg:items-center justify-between h-full pt-28 pb-12 lg:py-0">

        {/* Bottom Column (Mobile) / Left Column (Desktop): Copy and CTA */}
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start z-20 mt-12 lg:mt-0">
          <div className="max-w-[480px] mb-8 lg:mb-10">
            <p className="text-white text-sm lg:text-base font-medium font-['Inter'] leading-relaxed opacity-90 text-center lg:text-left fade-in">
              Wellness doesn't start with big leaps. It's all those small choices you make every day that add up and slowly shape how you live. That's the heart of Zewadi—making that shift feel natural, easy, and honestly, something you want to keep doing.
            </p>
          </div>

          <div className="w-full lg:w-auto flex justify-center lg:justify-start">
            <Link href="/about">
              <button className="bg-white rounded-full pl-6 pr-1.5 py-1.5 flex items-center gap-5 hover:bg-gray-100 transition-all group mb-12 lg:mb-32">
                <span className="font-['Inter'] text-[13px] text-[#0e2207] font-bold">
                  Discover More
                </span>
                <div className="w-9 h-9 rounded-full bg-[#b47800] flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </Link>
          </div>

          {/* About Us Card */}
          <div className="relative w-full max-w-[420px] lg:absolute lg:bottom-12">
            <div className="inline-block bg-white px-6 py-2 rounded-t-lg">
              <span className="font-['Playfair_Display'] font-bold text-[15px] text-[#121414]">
                About Us
              </span>
            </div>
            <div className="bg-white   p-5 flex items-center gap-5 shadow-2xl rounded-b-lg rounded-tr-lg">
              <div className="relative w-[100px] h-[70px] lg:w-[110px] lg:h-[75px] shrink-0 rounded overflow-hidden">
                <Image
                  src={images[current]}
                  alt="About Us"
                  fill
                  className="object-cover transition-opacity duration-500"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-['Inter'] font-semibold text-[15px] lg:text-[16px] text-[#171717] leading-tight mb-2 lg:mb-3">
                  Building a Healthier Society, Together
                </h3>
                <button className="flex items-center gap-1 font-['Inter'] text-[11px] text-[#555] font-bold uppercase tracking-widest group">
                  LEARN MORE
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transform -rotate-45 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Column (Mobile) / Right Column (Desktop): Giant Heading */}
        <div className="w-full lg:w-7/12 flex justify-center lg:justify-end -mt-6 lg:-mt-17">
          <h1 className="font-['Playfair_Display'] font-black text-4xl md:text-7xl lg:text-[90px] xl:text-[110px] text-white text-center lg:text-right leading-[1] lg:leading-[0.95] tracking-tight fade-in">
            The Zewadi<br className="hidden md:block" /> Way of<br className="hidden md:block" /> Living
          </h1>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;

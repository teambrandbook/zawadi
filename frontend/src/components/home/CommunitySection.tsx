import React from 'react';
import Image from 'next/image';
import Link from "next/link";


const CommunitySection = () => {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-50 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left Content */}
        <div className="w-full lg:w-[45%] flex flex-col items-start">
          <p className="text-[#3d634d] text-base lg:text-[22px] font-semibold font-['Inter'] mb-3 fade-in">
            Zewadi Community
          </p>

          <h2 className="text-[#121414] text-4xl lg:text-[64px] font-bold font-['Playfair_Display'] leading-[1.1] mb-8 fade-in">
            Eat Fresh. Live Well.
          </h2>

          <p className="text-[#444] text-sm lg:text-[15px] font-medium font-['Inter'] leading-relaxed mb-10 max-w-[480px] fade-in">
            This isn't just about food. It's about how we live, how we connect, how we grow one day at a time. The Zewadi community is made of people, just like you, trying to make better choices every day in their own way.
          </p>

          {/* Icons Row */}
          <div className="flex flex-wrap items-center gap-8 lg:gap-12 mb-12 fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                {/* Replace with your specific SVG icon for Wellness */}
                <Image src="/home/wellness.webp" alt="Wellness" width={40} height={40} />
              </div>
              <h3 className="text-[#121414] text-[16px] font-bold font-['Inter']">
                Wellness First
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                {/* Replace with your specific SVG icon for Inclusive */}
                <Image src="/home/inclusive.webp" alt="Inclusive" width={40} height={40} />
              </div>
              <h3 className="text-[#121414] text-[16px] font-bold font-['Inter']">
                Inclusive & Evolving
              </h3>
            </div>
          </div>

          <Link
            href="/about"
            className="bg-[#244d3a] text-white rounded-full pl-8 pr-1.5 py-1.5 flex items-center gap-5 hover:opacity-90 transition-all font-bold font-['Inter'] text-[14px]"
          >
            Discover More
            <div className="w-9 h-9 rounded-full bg-[#b47800] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Right Content - Image Stack */}
        {/* Right Content - Image Stack */}
        <div className="w-full lg:w-[55%] relative h-[350px] lg:h-[550px] mt-12 lg:mt-0 flex justify-center lg:block">

          {/* Inner wrapper to keep absolute elements contained and centered on mobile */}
          <div className="relative w-full max-w-[400px] lg:max-w-none h-full lg:mt-10">

            {/* 1. Dark Green Background Box (Far Right) */}
            {/* Changed right-[-30] to right-0 for better mobile containment */}
            <div className="zoom-item absolute right-0 top-0 z-0 h-[95%] w-[40%] overflow-hidden rounded-lg bg-[#1a3d2e] lg:right-[-30px]">
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "url('/Patterns-03.webp')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>

            {/* 2. Main Image (Middle Stack) */}
            <div className="zoom-item absolute right-[5%] top-[15%] w-[65%] h-[80%] rounded-xl overflow-hidden shadow-2xl z-10">
              <Image
                src="/home/communityBase.webp"
                alt="Sunset Field"
                fill
                className="object-cover"
              />

              {/* 100% Organic Floating Badge */}
              <div className="absolute bottom-2 left-2 right-2 lg:bottom-4 lg:left-4 lg:right-4 bg-[#1a3d2e]/90 backdrop-blur-md px-4 py-3 lg:px-6 lg:py-4 rounded-tl-2xl lg:rounded-tl-3xl rounded-tr-2xl lg:rounded-tr-3xl rounded-bl-2xl lg:rounded-bl-3xl rounded-br-none text-white flex items-center gap-3 lg:gap-4 z-20">
                <span className="text-2xl lg:text-4xl font-bold font-['Inter']">100%</span>
                <span className="text-[10px] lg:text-[14px] leading-tight font-medium opacity-90 uppercase tracking-wide">
                  Organic<br />products
                </span>
              </div>
            </div>

            {/* 3. Overlapping Small Image (Top Left) */}
            <div className="zoom-item absolute left-0 top-5 lg:top-10 w-[45%] h-[55%] rounded-xl overflow-hidden shadow-xl z-20 border-4 border-white">
              <Image
                src="/home/communityBase1.webp"
                alt="Crops"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;

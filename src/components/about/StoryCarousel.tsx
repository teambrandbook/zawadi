"use client";

import { useState } from "react";
import Image from "next/image";

const slides = [
    { id: 1, image: "/about/about-3.3.webp" },
    { id: 2, image: "/about/about-4.4.webp" },
    { id: 3, image: "/about/about-2.2.webp" },
];

export default function StoryCarousel() {
    const [activeIndex, setActiveIndex] = useState(1); // Default to middle slide

    const nextSlide = () => {
        setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const getPositionClass = (index: number) => {
        if (index === activeIndex) return "z-30 scale-100 opacity-100 translate-x-0";
        
        // Previous Slide
        if (index === (activeIndex === 0 ? slides.length - 1 : activeIndex - 1)) {
            return "z-20 md:scale-95 opacity-0 md:opacity-40 translate-x-0 md:-translate-x-24 lg:-translate-x-32 rotate-y-12 cursor-pointer hover:opacity-100";
        }
        
        // Next Slide
        return "z-20 md:scale-95 opacity-0 md:opacity-40 translate-x-0 md:translate-x-24 lg:translate-x-32 -rotate-y-12 cursor-pointer hover:opacity-100";
    };

    return (
        <section className="w-full bg-[#0A4834] py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden relative">
            <div className="max-w-[90rem] mx-auto flex flex-col items-center">

                {/* Header - Centered for better flow on full background */}
                <h2 className="font-display text-4xl md:text-6xl font-bold text-[#EAE3D2] mb-12 md:mb-16 tracking-tighter text-center z-30 relative pointer-events-none uppercase">
                    The Story Behind <br /> The Flavors
                </h2>

                {/* Carousel Container */}
                <div className="relative w-full h-[30rem] md:h-[42rem] flex items-center justify-center perspective-[1200px]">
                    
                    {/* Navigation Arrows */}
                    <button 
                        onClick={prevSlide}
                        className="absolute left-0 z-40 p-4 text-[#EAE3D2] hover:scale-125 transition-transform"
                        aria-label="Previous Slide"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button 
                        onClick={nextSlide}
                        className="absolute right-0 z-40 p-4 text-[#EAE3D2] hover:scale-125 transition-transform"
                        aria-label="Next Slide"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Slides Loop */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                onClick={() => setActiveIndex(index)}
                                className={`absolute transition-all duration-700 ease-in-out w-72 h-[24rem] md:w-[26rem] lg:w-[28rem] md:h-[34rem] lg:h-[38rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden ${getPositionClass(index)}`}
                            >
                                <Image
                                    src={slide.image}
                                    alt={`Story Slide ${slide.id}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Text */}
                <div className="relative z-30 mt-8 md:mt-12 max-w-2xl mx-auto text-center px-4">
                    <p className="font-sans text-[#EAE3D2] text-sm md:text-base leading-relaxed font-light">
                        Bridging the gap between technology and agriculture to redefine your food experience.<br className="hidden md:block"/> Our journey is rooted in sustainability and the passion for authentic taste.
                    </p>
                </div>

            </div>
        </section>
    );
}

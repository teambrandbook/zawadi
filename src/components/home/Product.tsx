"use client";

import { useState } from "react";
import Image from "next/image";

const products = [
    {
        id: 1,
        image: "/home/section6-1.webp",
        title: "Side product 1"
    },
    {
        id: 2,
        image: "/home/section6-center.webp",
        title: "Main Product"
    },
    {
        id: 3,
        image: "/home/section6-right.webp",
        title: "Side product 2"
    }
];

export default function Product() {
    const [activeIndex, setActiveIndex] = useState(1); // Default to center image

    const rotateLeft = () => {
        setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };

    const rotateRight = () => {
        setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    const getPositionClass = (index: number) => {
        if (index === activeIndex) return "z-30 scale-100 opacity-100 translate-x-0";

        // Product to the left of active
        if (index === (activeIndex === 0 ? products.length - 1 : activeIndex - 1)) {
            return "z-20 scale-90 opacity-0 md:opacity-40 translate-x-0 md:-translate-x-24 lg:-translate-x-32 rotate-y-12 cursor-pointer hover:opacity-100";
        }

        // Product to the right of active
        return "z-20 scale-90 opacity-0 md:opacity-40 translate-x-0 md:translate-x-24 lg:translate-x-32 -rotate-y-12 cursor-pointer hover:opacity-100";
    };

    return (
        <section className="w-full bg-white py-16 md:py-24 flex justify-center overflow-hidden">
            <div className="w-[95%] lg:w-[90%] max-w-[90rem] bg-[#9F8151] mx-auto relative pt-16 md:pt-24 pb-16 md:pb-24 px-6 md:px-16 lg:px-24 rounded-sm shadow-inner transition-all duration-700">

                {/* Header - Top Left */}
                <h2 className="font-display text-5xl md:text-7xl font-bold text-[#EAE3D2] mb-12 tracking-tighter text-left z-30 relative pointer-events-none">
                    Our Product
                </h2>

                {/* Carousel Container */}
                <div className="relative w-full h-[30rem] md:h-[42rem] flex items-center justify-center perspective-[1200px]">

                    {/* Navigation Arrows */}
                    <button
                        onClick={rotateLeft}
                        className="absolute left-0 z-40 p-4 text-[#EAE3D2] hover:scale-125 transition-transform"
                        aria-label="Previous Product"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={rotateRight}
                        className="absolute right-0 z-40 p-4 text-[#EAE3D2] hover:scale-125 transition-transform"
                        aria-label="Next Product"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Images Loop */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                onClick={() => setActiveIndex(index)}
                                className={`absolute transition-all duration-700 ease-in-out w-72 h-[24rem] md:w-[26rem] lg:w-[28rem] md:h-[34rem] lg:h-[38rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden ${getPositionClass(index)}`}
                            >
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description Text */}
                <div className="relative z-30 mt-8 md:mt-12 max-w-2xl mx-auto text-center px-4">
                    <p className="font-sans text-[#EAE3D2] text-sm md:text-base leading-relaxed font-light">
                        Bridging the gap between technology and agriculture to redefine your food experience.<br className="hidden md:block" /> Explore our premium selection of organic and sustainable products.
                    </p>
                </div>

            </div>
        </section>
    );
}

"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Main Timeline for coordinated reveal
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                once: true
            }
        });

        // Header Reveal
        tl.from(".hero-header", {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.inOut"
        })
        // Image Reveal (Left-to-Right Wipe)
        .from(".hero-image-wipe", {
            clipPath: "inset(0% 100% 0% 0%)",
            opacity: 0,
            x: -20,
            duration: 1.2,
            stagger: 0.2, // Staggered wipe across multiple images
            ease: "power3.inOut"
        }, "-=0.6")
        // Text Block Reveal
        .from(".hero-text", {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.inOut"
        }, "-=0.8");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full bg-white pt-40 pb-12 md:pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Header Section */}
                <div className="hero-header text-center max-w-4xl mb-16 md:mb-20">
                    <h1 className="font-boldonse text-3xl md:text-4xl lg:text-5xl font-light text-black mb-8 tracking-tight leading-[1.5]">
                        The story behind the <br /> flavors
                    </h1>
                    <p className="font-mulish text-[#555] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        Zewadi is a premium food brand developed to redefine the way we experience everyday nutrition. Rooted in quality, intention, and simplicity, we create products that bring together clean ingredients and refined taste.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">

                    {/* Left Column: Large Vertical Image */}
                    <div className="hero-image-wipe w-full md:h-[600px] max-sm:h-[400px] aspect-[3/4]  relative rounded-sm overflow-hidden shadow-sm group bg-[#f8f8f8]">
                        <Image 
                            src="/about/about-1.1.webp" 
                            alt="About Hero Vertical" 
                            fill 
                            className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                        />
                    </div>

                    {/* Right Column: Smaller Image + Text */}
                    <div className="flex flex-col gap-8 md:gap-12">
                        {/* Top Image */}
                        <div className="hero-image-wipe w-full  aspect-[5/4] relative rounded-sm overflow-hidden shadow-sm group bg-[#f8f8f8]">
                            <Image 
                                src="/about/about-2.2.webp" 
                                alt="About Hero Square" 
                                fill 
                                className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                            />
                        </div>

                        {/* Text Block */}
                        <p className="hero-text font-mulish text-[#555] text-base md:text-lg leading-relaxed">
                            Zewadi is a premium food brand, but there’s a lot more behind the name. It started with one simple idea: make everyday food easier, better, and more meaningful. Every product is made with real care. We focus on quality, on balance, and on how our food actually fits into your life. Food shouldn’t be complicated. It should just feel right.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

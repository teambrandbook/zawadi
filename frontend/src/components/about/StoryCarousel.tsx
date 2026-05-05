"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type MatchMediaConditions = {
    sm?: boolean;
};

const slides = [
    {
        id: 1,
        title: "Purity & Heritage",
        image: "/about/about-3.3.webp",
        desc: "Zewadi was created with a vision to bring meaning back into the way we experience food. Every flavor is thoughtfully developed to reflect a balance of health, quality, and everyday enjoyment. It’s about turning simple choices into more intentional, fulfilling ones."
    },
    {
        id: 2,
        title: "Elite Organic",
        image: "/about/about-4.4.webp",
        desc: "Our global presence is defined by an unwavering commitment to purity, cultivating an elite organic heritage that empowers local farmers while delivering world-class excellence to your table."
    },
    {
        id: 3,
        title: "Soil to Soul",
        image: "/about/about-2.2.webp",
        desc: "From the soil to the soul, we are crafting a new standard of agricultural discovery—one where transparency and artisan craft converge to define the future of sustainable living."
    },
];

export default function StoryCarousel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [resizeKey, setResizeKey] = useState(0);

    // Force re-calculation on resize to prevent "shattering"
    useGSAP(() => {
        const handleResize = () => setResizeKey(prev => prev + 1);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, { scope: containerRef });

    const next = () => {
        if (isAnimating) return;
        setActiveIndex((prev) => (prev + 1) % slides.length);
    };

    const prev = () => {
        if (isAnimating) return;
        setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useGSAP(() => {
        if (!containerRef.current) return;

        const cards = containerRef.current.querySelectorAll(".story-card");
        const texts = containerRef.current.querySelectorAll(".story-text");

        if (!cards.length || !texts.length) return;

        const mm = gsap.matchMedia();

        mm.add({
            sm: "(max-width: 767px)",
            md: "(min-width: 768px)",
        }, (context) => {
            const { sm } = context.conditions as MatchMediaConditions;

            setIsAnimating(true);

            const numSlides = slides.length;

            cards.forEach((card, i) => {
                const text = texts[i];

                let pos = i - activeIndex;
                if (pos > 1) pos -= numSlides;
                if (pos < -1) pos += numSlides;

                let scale = 1;
                let opacity = 0;
                let zIndex = 10;
                let rotationY = 0;
                let z = 0;
                let x = 0;

                const spread = sm ? 160 : 260; 
                const baseScale = sm ? 0.75 : 0.8;

                if (pos === 0) {
                    x = 0; opacity = 1; scale = 1; zIndex = 50; rotationY = 0; z = 0;
                } else if (pos === 1) {
                    x = spread; opacity = 0.5; scale = baseScale; zIndex = 20; rotationY = -25; z = -180;
                } else if (pos === -1) {
                    x = -spread; opacity = 0.5; scale = baseScale; zIndex = 20; rotationY = 25; z = -180;
                } else {
                    x = pos > 0 ? spread * 1.5 : -spread * 1.5; opacity = 0; zIndex = 10; rotationY = pos > 0 ? -35 : 35; z = -350;
                }

                gsap.to(card, {
                    x,
                    xPercent: -50,
                    y: 0,
                    scale,
                    opacity,
                    zIndex,
                    rotationY,
                    z,
                    duration: 1.4,
                    ease: "expo.out",
                    onComplete: () => setIsAnimating(false),
                    overwrite: "auto"
                });

                gsap.to(text, {
                    opacity: pos === 0 ? 1 : 0,
                    y: pos === 0 ? 0 : 20,
                    duration: 0.6,
                    ease: "power2.out",
                    overwrite: true
                });
            });
        });

        return () => mm.revert();
    }, [activeIndex, resizeKey]);

    return (
        <section className="w-full bg-[#0A4834] py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div ref={containerRef} className="max-w-[85rem] mx-auto relative flex flex-col items-center">

                {/* Header Zone */}
                <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-[#EAE3D2] tracking-tighter leading-tight text-center mb-16 md:mb-24">
                    The story behind the <br className="hidden md:block" /> flavors
                </h2>

                {/* Carousel Zone */}
                <div className="relative w-full flex justify-center items-center h-[300px] md:h-[450px] z-20" style={{ perspective: "1500px" }}>
                    {slides.map((slide, idx) => {
                        const isCenter = idx === activeIndex;
                        return (
                            <div
                                key={slide.id}
                                onClick={() => !isCenter && setActiveIndex(idx)}
                                className={`story-card absolute left-1/2 w-48 md:w-[22rem] aspect-[4/5] rounded-sm will-change-transform flex flex-col items-center ${!isCenter ? "cursor-pointer" : ""}`}
                            >
                                <div className="relative w-full h-full overflow-hidden rounded-sm shadow-2xl border border-white/10">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority={idx === 0}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Narrative Zone */}
                <div className="w-full flex justify-center items-center mt-12 min-h-[100px]">
                    {slides.map((slide, idx) => (
                        <div
                            key={`text-${slide.id}`}
                            className="story-text absolute max-w-2xl text-center flex flex-col items-center gap-4 opacity-0 px-4"
                        >
                            <p className="font-mulish text-[#EAE3D2]/80 text-sm md:text-base lg:text-[1.05rem] leading-relaxed px-4">
                                {slide.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-50 px-4 md:px-10">
                    <button
                        onClick={prev}
                        className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center rounded-full border border-[#EAE3D2]/20 text-[#EAE3D2] hover:bg-[#EAE3D2]/10 transition-colors pointer-events-auto"
                        aria-label="Previous slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        className="w-12 md:w-14 h-12 md:h-14 flex items-center justify-center rounded-full border border-[#EAE3D2]/20 text-[#EAE3D2] hover:bg-[#EAE3D2]/10 transition-colors pointer-events-auto"
                        aria-label="Next slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>

            </div>
        </section>
    );
}

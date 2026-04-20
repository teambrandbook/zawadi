"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

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
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add({
                isMobile: "(max-width: 767px)",
                isTablet: "(min-width: 768px) and (max-width: 1023px)",
                isDesktop: "(min-width: 1024px)"
            }, (context) => {
                const { isMobile, isTablet } = context.conditions as any;

                // Responsive Orbital Configs - Narrower Spread for Stacked Look
                const spreadX = isMobile ? 65 : (isTablet ? 55 : 45); // xPercent spread for 'half-hidden'
                const rotationY = isMobile ? 75 : 60; // rotateY degrees
                const depthZ = isMobile ? -600 : -500; // deeper z translation

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                    }
                });

                const numSlides = slides.length;
                const stepDuration = 1 / numSlides;

                // Set balanced initial states for a 'Before-Current-Next' physical stack
                slides.forEach((_, i) => {
                    const card = cardRefs.current[i];
                    const currentText = textRefs.current[i];
                    if (!card || !currentText) return;

                    // Orbital Distribution for 3 cards
                    // Card 0: Center (Front), Card 1: Right (Behind), Card 2: Left (Behind)
                    const xPercent = i === 0 ? 0 : (i === 1 ? spreadX : -spreadX);
                    const z = i === 0 ? 0 : depthZ;
                    const rotateY = i === 0 ? 0 : (i === 1 ? -rotationY : rotationY);
                    const autoAlpha = i === 0 ? 1 : 0.35;
                    const scale = i === 0 ? 1 : 0.75;
                    const zIndex = i === 0 ? 50 : 10;

                    gsap.set(card, { xPercent, z, rotateY, autoAlpha, scale, zIndex });
                    gsap.set(currentText, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 });
                });

                // Transitions - High-Fidelity Orbital 'Ring' with Stack-Layering
                slides.forEach((_, i) => {
                    const currentCard = cardRefs.current[i];
                    const nextCard = cardRefs.current[(i + 1) % numSlides];
                    const currentText = textRefs.current[i];
                    const nextText = textRefs.current[(i + 1) % numSlides];

                    if (!currentCard || !currentText) return;

                    const startTime = i * stepDuration;

                    if (i < numSlides - 1) {
                        // Current card moves to LEFT and drops behind
                        tl.to(currentCard, {
                            xPercent: -spreadX,
                            z: depthZ,
                            rotateY: rotationY,
                            autoAlpha: 0.35,
                            scale: 0.75,
                            zIndex: 10,
                            duration: stepDuration,
                            ease: "power2.inOut"
                        }, startTime);

                        // Next card SHUFFLES to CENTER and brings to front
                        if (nextCard) {
                            tl.to(nextCard, {
                                xPercent: 0,
                                z: 0,
                                rotateY: 0,
                                autoAlpha: 1,
                                scale: 1,
                                zIndex: 50,
                                duration: stepDuration,
                                ease: "power2.inOut"
                            }, startTime);
                        }

                        // Ensure the third card is correctly placed to loop from the RIGHT
                        const thirdCardIndex = (i + 2) % numSlides;
                        const thirdCard = cardRefs.current[thirdCardIndex];
                        if (thirdCard) {
                            tl.to(thirdCard, {
                                xPercent: spreadX,
                                rotateY: -rotationY,
                                zIndex: 10,
                                duration: stepDuration,
                                ease: "power2.inOut"
                            }, startTime);
                        }

                        // Narrative discovery transitions
                        tl.to(currentText, { autoAlpha: 0, y: -20, duration: stepDuration * 0.5, ease: "power1.out" }, startTime);
                        if (nextText) {
                            tl.to(nextText, { autoAlpha: 1, y: 0, duration: stepDuration * 0.5, ease: "power1.in" }, startTime + (stepDuration * 0.5));
                        }
                    }
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative h-[400vh] bg-[#0A4834]">
            {/* STICKY STAGE */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start overflow-hidden">

                {/* Visual Container - Premium Story Surface */}
                <div ref={containerRef} className="w-[96%] lg:w-[94%] max-w-[130rem] h-[95vh] lg:h-[98vh] mx-auto relative flex flex-col items-center justify-start rounded-sm overflow-hidden p-8 pt-10 lg:p-14 lg:pt-12">                    {/* Header Zone */}
                    <div className="w-full flex justify-center absolute top-10 md:top-24 lg:top-6 px-6">
                        <h2 className="section-header font-display text-2xl md:text-4xl lg:text-5xl font-light text-[#EAE3D2] tracking-tighter leading-tight text-center">
                            The story behind the <br className="hidden md:block" /> flavors
                        </h2>
                    </div>

                    {/* Image Orbit Zone - Refined Vertical Positioning */}
                    <div className="relative w-full flex items-center justify-center z-20 mt-44 md:mt-72 lg:mt-32" style={{ perspective: "2000px" }}>
                        <div className="relative w-full h-[22rem] md:h-[32rem] lg:h-[22rem] flex items-center justify-center overflow-visible">
                            {slides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    ref={el => { cardRefs.current[index] = el; }}
                                    className="absolute w-60 h-[22rem] md:w-[26rem] md:h-[32rem] lg:w-[20rem] lg:h-[22rem] rounded-sm overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] border border-white/10 bg-black will-change-transform"
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Narrative Hub */}
                    <div className="w-full relative mt-12 md:mt-32 lg:mt-4 flex flex-col items-center justify-center z-50">
                        <div className="relative w-full max-w-5xl min-h-[6rem] flex flex-col items-center justify-center px-6">
                            {slides.map((slide, index) => (
                                <p
                                    key={`desc-${slide.id}`}
                                    ref={el => { textRefs.current[index] = el; }}
                                    className="absolute font-mulish text-[#EAE3D2] text-sm md:text-base lg:text-lg text-center leading-snug tracking-wide opacity-80 font-light max-w-2xl px-4"
                                >
                                    {slide.desc}
                                </p>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}

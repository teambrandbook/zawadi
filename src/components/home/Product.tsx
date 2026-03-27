"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const products = [
    {
        id: 1,
        image: "/home/section6-1.webp",
        title: "Dried Fruits & Nuts",
        desc: "Bridging the gap between technology and agriculture to redefine your food experience. Our premium nut harvest brings the richness of the soil directly to your lifestyle."
    },
    {
        id: 2,
        image: "/home/section6-center.webp",
        title: "Raw Zewadi Honey",
        desc: "Experience the ultimate in sustainable agriculture. Our raw, unfiltered Zewadi honey captures the essence of heritage blooms in every drop."
    },
    {
        id: 3,
        image: "/home/section6-right.webp",
        title: "Organic Green Tea",
        desc: "Redefining purity and taste. Explore our specialized range of organic tea leaves, meticulously hand-plucked and crafted for the elite connoisseur."
    }
];

export default function Product() {
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
                
                // Responsive Orbital Configs - Calibrated for Exactly 50% Overlap
                const spreadX = 50; // xPercent for 'half-hidden'
                const rotationY = isMobile ? 80 : 70; // Aggressive rotateY for tucked feel
                const depthZ = isMobile ? -600 : -600; // Deep z translation for layered look

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                    }
                });

                const numSlides = products.length;
                const stepDuration = 1 / numSlides;

                // Set balanced initial states for a 'Focus-Stack' physical layout
                products.forEach((_, i) => {
                    const card = cardRefs.current[i];
                    const currentText = textRefs.current[i];
                    if (!card || !currentText) return;

                    // Orbital Distribution for 3 products - 'Before-Current-Next'
                    // Product 0: Center, Product 1: Right (50% overlap), Product 2: Left (50% overlap)
                    const xPercent = i === 0 ? 0 : (i === 1 ? spreadX : -spreadX);
                    const z = i === 0 ? 0 : depthZ;
                    const rotateY = i === 0 ? 0 : (i === 1 ? -rotationY : rotationY);
                    const autoAlpha = i === 0 ? 1 : 0.35;
                    const scale = i === 0 ? 1 : 0.75;
                    const zIndex = i === 0 ? 50 : 10;

                    gsap.set(card, { xPercent, z, rotateY, autoAlpha, scale, zIndex });
                    gsap.set(currentText, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 });
                });

                // Transitions - High-Fidelity Orbital 'Ring' Interaction
                products.forEach((_, i) => {
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

                        // Product discovery transitions
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
        <section ref={sectionRef} className="relative h-[400vh] bg-white">
            {/* STICKY STAGE */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Visual Container - Brand Gold Surface */}
                <div ref={containerRef} className="w-[96%] lg:w-[94%] max-w-[130rem] h-[95vh] lg:h-[98vh] bg-[#9F8151] mx-auto relative flex flex-col items-center justify-start rounded-sm shadow-2xl overflow-hidden p-6 md:p-10 lg:p-14">
                    
                    {/* Header Zone */}
                    <div className="w-full flex justify-start absolute top-14 left-6 md:top-32 lg:top-8 lg:left-24 px-6 md:px-0">
                        <h2 className="section-header font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[#EAE3D2] tracking-tighter uppercase leading-none text-left">
                            Our Product
                        </h2>
                    </div>

                    {/* Image Orbit Zone - Refined Vertical Positioning */}
                    <div className="relative w-full flex items-center justify-center z-20 mt-40 md:mt-72 lg:mt-24" style={{ perspective: "2000px" }}>
                        <div className="relative w-full h-[26rem] md:h-[32rem] lg:h-[22rem] flex items-center justify-center overflow-visible">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    ref={el => { cardRefs.current[index] = el; }}
                                    className="absolute w-64 h-[26rem] md:w-[26rem] md:h-[32rem] lg:w-[20rem] lg:h-[22rem] rounded-sm overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] border border-white/10 bg-black will-change-transform"
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Narrative Hub - Refined Vertical Positioning */}
                    <div className="w-full relative mt-6 md:mt-24 lg:mt-2 flex flex-col items-center justify-center z-50">
                        <div className="relative w-full max-w-5xl min-h-[4rem] flex flex-col items-center justify-center px-6">
                            {products.map((product, index) => (
                                <p
                                    key={`desc-${product.id}`}
                                    ref={el => { textRefs.current[index] = el; }}
                                    className="absolute font-sans text-[#EAE3D2] text-sm md:text-base lg:text-lg text-center leading-snug tracking-wide opacity-80 font-light max-w-2xl px-4"
                                >
                                    {product.desc}
                                </p>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}



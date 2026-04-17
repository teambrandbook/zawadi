"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Health() {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !leftRef.current || !rightRef.current) return;

        // ✅ Register plugin here (safe)
        gsap.registerPlugin(ScrollTrigger);

        // ✅ GSAP context (important)
        const ctx = gsap.context(() => {

            // Left animation
            gsap.from(leftRef.current, {
                opacity: 0,
                x: -50,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: leftRef.current,
                    start: "top 85%",
                    once: true,
                }
            });

            // Right animation
            gsap.from(rightRef.current, {
                opacity: 0,
                x: 200,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.2,
                scrollTrigger: {
                    trigger: rightRef.current,
                    start: "top 85%",
                    once: true,
                }
            });

        }, containerRef);

        // ✅ Cleanup (very important)
        return () => ctx.revert();

    }, []);

    return (
        <section
            ref={containerRef}
            className="w-full bg-[#0A4834] py-24 px-6 md:px-12 lg:px-24 overflow-hidden relative"
        >
            <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-0 md:gap-12 items-center">

                {/* Left Column */}
                <div
                    ref={leftRef}
                    className="lg:col-span-3 flex flex-col gap-8 z-10 relative"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-6xl font-light text-white mb-5 tracking-tighter leading-[1.5] drop-shadow-sm">
                        Moments Worth <br className="hidden md:block" /> Sharing
                    </h2>
                    <div className="font-mulish text-gray-300 text-base md:text-lg leading-relaxed max-w-lg lg:max-w-xl opacity-90 font-light space-y-4">
                        <p>
                            Every Zewadi experience is designed to bring people closer - through shared meals, thoughtful gestures, and meaningful moments.
                        </p>
                        <p>
                            It’s about creating a sense of warmth in everyday life, where food becomes a part of your story.
                        </p>
                        <p>
                            Because the moments we share today are the memories we carry tomorrow.
                        </p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 relative h-[200px] md:h-[400px] w-full lg:w-[150%] lg:-mr-[50%] ml-[10%] z-10 flex justify-end mt-12 lg:mt-0">
                    <div
                        ref={rightRef}
                        className="relative w-full h-full bg-[#222] rounded-l-full overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-y border-l border-white/10"
                    >
                        <Image
                            src="/home/section8.webp"
                            alt="Health and Wellness"
                            fill
                            className="object-cover scale-100 hover:scale-110 transition-transform duration-[3000ms] ease-out"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
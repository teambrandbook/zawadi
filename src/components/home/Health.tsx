"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Health() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Left Column Reveal
        gsap.from(".reveal-left", {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".reveal-left",
                start: "top 85%",
                once: true
            }
        });

        // Right Column Luxury Reveal
        gsap.from(".reveal-right", {
            opacity: 0,
            x: 200,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.2,
            scrollTrigger: {
                trigger: ".reveal-right",
                start: "top 85%",
                once: true
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full bg-[#0A4834] py-24 px-6 md:px-12 lg:px-24 overflow-hidden relative">
            <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-0 md:gap-12 items-center">

                {/* Left Column: Text Content */}
                <div className="reveal-left lg:col-span-3 flex flex-col gap-8 z-10 relative">
                    <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white mb-2 uppercase tracking-tighter leading-[0.9] drop-shadow-sm">
                        Where Every Meal <br className="hidden md:block" /> Becomes a Memory
                    </h2>
                    <p className="font-sans text-gray-300 text-lg md:text-xl leading-relaxed max-w-lg lg:max-w-xl opacity-90 font-light">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
                    </p>
                </div>

                {/* Right Column: Image Shape */}
                <div className="lg:col-span-2 relative h-[400px] md:h-[600px] w-full lg:w-[150%] lg:-mr-[50%] sm:ml-[10%] z-10 flex justify-end mt-12 lg:mt-0">
                    <div className="reveal-right relative w-full h-full bg-[#222] rounded-l-full overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-y border-l border-white/10">
                        <Image
                            src="/home/section8.webp"
                            alt="Health and Wellness"
                            fill
                            className="object-cover scale-105 hover:scale-110 transition-transform duration-[3000ms] ease-out"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}

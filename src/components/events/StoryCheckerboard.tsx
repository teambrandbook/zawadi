"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function StoryCheckerboard() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Image blocks reveals
        gsap.utils.toArray<HTMLElement>(".ch-image").forEach((img) => {
            gsap.from(img, {
                opacity: 0,
                scale: 1.05,
                duration: 1.4,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: img,
                    start: "top 85%",
                    once: true
                }
            });
        });

        // Text blocks reveals
        gsap.utils.toArray<HTMLElement>(".ch-text").forEach((text) => {
            gsap.from(text, {
                opacity: 0,
                y: 30,
                duration: 1.2,
                delay: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                    once: true
                }
            });
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2">

                {/* Block 1: Image (Top Left) */}
                <div className="ch-image aspect-square relative w-full h-full min-h-[400px] overflow-hidden bg-[#f0f0f0]">
                    <Image 
                        src="/events/event-2.webp" 
                        alt="Event Story 1" 
                        fill 
                        priority 
                        className="object-cover" 
                    />
                </div>

                {/* Block 2: Text (Top Right) */}
                <div className="ch-text aspect-square bg-[#0A4834] w-full h-full min-h-[350px] md:min-h-[400px] p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col justify-center">
                    <h3 className="font-display text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-[#EAE3D2] mb-6 lg:mb-8 uppercase tracking-tighter leading-[0.85]">
                        Zewadi <br /> story
                    </h3>
                    <p className="font-sans text-[#EAE3D2]/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg font-medium">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Block 3: Text (Bottom Left) */}
                <div className="ch-text aspect-square bg-[#0A4834] w-full h-full min-h-[350px] md:min-h-[400px] p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col justify-center order-last md:order-none">
                    <h3 className="font-display text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-[#EAE3D2] mb-6 lg:mb-8 uppercase tracking-tighter leading-[0.85]">
                        Zewadi <br /> story
                    </h3>
                    <p className="font-sans text-[#EAE3D2]/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg font-medium">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Block 4: Image (Bottom Right) */}
                <div className="ch-image aspect-square relative w-full h-full min-h-[400px] overflow-hidden bg-[#f0f0f0]">
                    <Image 
                        src="/events/event-3.webp" 
                        alt="Event Story 2" 
                        fill 
                        className="object-cover" 
                    />
                </div>

            </div>
        </section>
    );
}

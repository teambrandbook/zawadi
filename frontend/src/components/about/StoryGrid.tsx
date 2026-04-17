"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function StoryGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    const stories = [
        { id: "01", title: "Thoughtfully Crafted", description: "We sweat the details, so you can just enjoy." },
        { id: "02", title: "Inspired by Living Well", description: "Made for real, everyday life." },
        { id: "03", title: "Made to Share", description: "Always better when it’s shared." },
        { id: "04", title: "Driven by Purpose", description: "There’s a reason behind every decision we make." },
    ];

    useGSAP(() => {
        // Title Reveal
        gsap.from(".story-grid-title", {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.inOut",
            scrollTrigger: {
                trigger: ".story-grid-title",
                start: "top 85%",
                once: true
            }
        });

        // Cards Staggered Reveal
        gsap.from(".story-card", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".cards-grid",
                start: "top 85%",
                once: true
            }
        });
    }, { scope: containerRef });

    const handleHover = (el: HTMLElement) => {
        const shine = el.querySelector(".shine-effect");
        if (shine) {
            gsap.fromTo(shine,
                { x: "-170%" },
                { x: "170%", duration: 1.2, ease: "power3.inOut" }
            );
        }
    };

    return (
        <section ref={containerRef} className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* 1. Fading Title */}
                <h2 className="story-grid-title font-display text-3xl md:text-5xl lg:text-6xl font-light text-black text-center mb-24 md:mb-32 tracking-tighter leading-[1.5]">
                    The story behind the <br /> flavors
                </h2>

                {/* Grid Container */}
                <div className="cards-grid w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            onMouseEnter={(e) => handleHover(e.currentTarget)}
                            className="story-card group relative bg-[#0A4834] p-8 md:p-12 gap-8 md:gap-10 items-start rounded-sm overflow-hidden cursor-pointer"
                        >
                            {/* MODERN DIAGONAL SHINING EFFECT LAYER */}
                            <div className="flex gap-10">
                                <div
                                    className="shine-effect absolute inset-x-0 -top-full h-[300%] w-[350%] z-10 pointer-events-none -skew-x-12 translate-x-[-170%]"
                                    style={{
                                        background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.02) 60%, transparent 100%)",
                                        left: "-120%"
                                    }}
                                />

                                {/* Background Overlay for slight depth on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                                {/* Number */}
                                <span className="relative z-20 font-display text-4xl md:text-6xl font-light text-[#EAE3D2] tracking-tighter leading-none">
                                    {story.id}
                                </span>

                                {/* Text Content */}
                                <div className="relative z-20 flex flex-col gap-3 pt-3">
                                    <h3 className="font-display text-lg md:text-xl font-light text-[#EAE3D2] tracking-tight">
                                        {story.title}
                                    </h3>

                                    {/* ✅ Only visible in lg */}
                                    <p className="hidden lg:block font-mulish text-[#EAE3D2]/80 text-sm md:text-base leading-relaxed max-w-sm">
                                        {story.description}
                                    </p>
                                </div>
                            </div>

                            {/* ✅ Only visible in sm & md */}
                            <div>
                                <p className="block lg:hidden font-mulish text-[#EAE3D2]/80 text-sm md:text-base leading-relaxed max-w-sm">
                                    {story.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
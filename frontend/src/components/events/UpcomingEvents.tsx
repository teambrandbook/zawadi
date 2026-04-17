"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function UpcomingEvents() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Timeline for coordinated reveal
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
                once: true
            }
        });

        // Header reveals
        tl.from(".event-heading", {
            opacity: 0,
            x: -60,
            duration: 1.2,
            ease: "power3.inOut"
        })
        .from(".event-desc", {
            opacity: 0,
            x: -60,
            duration: 1.2,
            ease: "power3.inOut"
        }, "-=0.9") // Staggered by 0.3s relative to heading

        // Cards reveals with pronounced sequential gaps
        .from(".event-card-1", {
            opacity: 0,
            y: -100,
            duration: 1.4,
            ease: "power3.inOut"
        }, "-=0.4") // Starts at 0.8s total (since heading/desc overlap)
        
        .from(".event-card-2", {
            opacity: 0,
            y: -100,
            duration: 1.4,
            ease: "power3.inOut"
        }, "+=0.6"); // Sequential gap of 2 seconds from start - approximately

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto flex flex-col gap-12 md:gap-16">

                {/* Header - STAGGERED LATERAL FADE */}
                <div className="flex flex-col gap-4 max-w-3xl">
                    <h2 className="event-heading font-display text-3xl md:text-4xl lg:text-6xl font-light text-black tracking-tight leading-none mb-4">
                        Upcoming Events
                    </h2>
                    <p className="event-desc font-mulish text-[#555] text-sm md:text-lg leading-relaxed max-w-2xl opacity-80">
                        There’s always something happening at Zewadi. From small, thoughtful gatherings to special experiences, each event is a chance to connect, explore, and be part of something more.<br/>Take a look at what’s coming up and join us whenever it feels right.
                    </p>
                </div>

                {/* Cards Grid - ONE-BY-ONE VERTICAL DISCOVERY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Card 1 - FIRST ACTOR */}
                    <div className="event-card-1 bg-[#D9D9D9] p-8 md:p-10 lg:p-14 rounded-none aspect-square md:aspect-[4/3] flex flex-col justify-end relative overflow-hidden group shadow-lg">
                        <Image src="/events/event-4.webp" alt="Event 4" fill priority className="object-cover transition-transform duration-1000 group-hover:scale-110 ease-out" />
                        <div className="absolute inset-0 bg-black/40 z-0 group-hover:bg-black/20 transition-colors duration-700"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-end justify-between w-full gap-6">
                            <div className="flex flex-col gap-3">
                                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-white leading-[1.5] tracking-tighter mb-4">
                                    Upcoming <br /> Events
                                </h3>
                                <p className="font-mulish text-white/90 text-sm md:text-base font-bold tracking-tight opacity-70">
                                    Lorem ipsum dolor
                                </p>
                            </div>

                            <button className="px-6 py-3 bg-[#0A4834] rounded-full hover:brightness-110 transition-all shadow-xl text-white font-mulish text-[11px] md:text-xs font-black uppercase tracking-wider shrink-0 active:scale-95">
                                Read More
                            </button>
                        </div>
                    </div>

                    {/* Card 2 - SECOND ACTOR */}
                    <div className="event-card-2 bg-[#D9D9D9] p-8 md:p-10 lg:p-14 rounded-none aspect-square md:aspect-[4/3] flex flex-col justify-end relative overflow-hidden group shadow-lg">
                        <Image src="/events/event-5.webp" alt="Event 5" fill className="object-cover transition-transform duration-1000 group-hover:scale-110 ease-out" />
                        <div className="absolute inset-0 bg-black/40 z-0 group-hover:bg-black/20 transition-colors duration-700"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-end justify-between w-full gap-6">
                            <div className="flex flex-col gap-3">
                                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-light text-white leading-[1.5] tracking-tighter mb-4">
                                    Upcoming <br /> Events
                                </h3>
                                <p className="font-mulish text-white/90 text-sm md:text-base font-bold tracking-tight opacity-70">
                                    Lorem ipsum dolor
                                </p>
                            </div>

                            <button className="px-6 py-3 bg-[#0A4834] rounded-full hover:brightness-110 transition-all shadow-xl text-white font-mulish text-[11px] md:text-xs font-black uppercase tracking-wider shrink-0 active:scale-95">
                                Read More
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}

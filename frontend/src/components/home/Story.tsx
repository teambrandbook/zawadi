"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const timelineItems = [
    {
        id: 1,
        image: "/home/section4-1.webp",
        title: "",
        desc: "",
        storyText: "Zewadi started with a simple thought—food should be more than just filling. It should bring people together, create small moments, and add meaning to daily life. That idea took root and kept growing, turning into more than we ever planned."
    },
    {
        id: 2,
        image: "/home/section4-2.webp",
        title: "",
        desc: "",
        storyText: "Gifting, somewhere along the way, got a little too routine. We wanted to bring back the real feeling behind it. With Zewadi, gifting food turns intentional—it becomes something personal, not just something you pick up on the go."
    },
    {
        id: 3,
        image: "/home/section4-3.webp",
        title: "",
        desc: "",
        storyText: "Zewadi grew up around people who care about how they live. They want balance but don’t want to make life complicated. It’s less about what you buy, and more about being part of something that’s genuinely getting better—with everyone involved.."
    },
    {
        id: 4,
        image: "/home/section5-1.webp",
        title: "",
        desc: "",
        storyText: "Zewadi fits into your day without pressure. It naturally finds its place in your routines and habits, so living well feels right—not like a chore."
    }
];

export default function Story() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    useGSAP(() => {
        if (!sectionRef.current) return;

        // Create the main scroll-driven timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                pin: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    setScrollProgress(progress);
                    
                    // Determine active index based on progress
                    const itemsCount = timelineItems.length;
                    const step = 1 / itemsCount;
                    const newIndex = Math.min(Math.floor(progress / step), itemsCount - 1);
                    setActiveIndex(newIndex);
                }
            }
        });

        // Header Reveal (separate from scroll progression)
        gsap.from(".header-item", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".story-header",
                start: "top 85%",
                once: true
            }
        });

        ScrollTrigger.refresh();
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative h-[300vh] bg-white">
            {/* Content Wrapper (Pinned by GSAP) */}
            <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-between py-4 px-4 md:px-12">

                    {/* Header Section */}
                    <div className="story-header text-center w-full max-w-4xl z-30">
                        <h2 className="header-item font-playfair text-2xl md:text-6xl font-semibold text-[#000000] mb-4 tracking-tighter uppercase">
                            Where it began
                        </h2>
                        <p key={activeIndex} className="font-mulish text-[#000000] text-xs md:text-sm leading-relaxed max-w-2xl mx-auto transition-all duration-700 ease-in-out opacity-100 min-h-[5rem] md:min-h-[3.5rem] animate-in fade-in slide-in-from-bottom-2 duration-1000">
                            {timelineItems[activeIndex].storyText}
                        </p>
                    </div>

                    {/* Timeline Section - Compact & Floating */}
                    <div className="inner-timeline relative w-full max-w-3xl z-30 mb-4 px-6">
                        {/* Background Line */}
                        <div className="absolute top-1/2 left-[8.5%] right-[8.5%] md:left-[4.5%] md:right-[4.5%] h-[1px] bg-black/10 -translate-y-1/2 z-0" />

                        {/* Active Progress Line */}
                        <div
                            className="absolute top-1/2 left-[8.5%] md:left-[4.5%] h-[1.5px] bg-[#0A4834] -translate-y-1/2 z-0 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(10,72,52,0.3)]"
                            style={{
                                width: `calc(${scrollProgress * 91}%)`
                            }}
                        />

                        <div className="relative z-10 flex justify-between items-center w-full">
                            {timelineItems.map((item, index) => (
                                <div key={item.id} className="relative group p-4 cursor-pointer">
                                    {/* The Circle */}
                                    <div
                                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-700 ${index <= activeIndex
                                                ? "bg-[#0A4834] scale-150 shadow-[0_0_15px_rgba(10,72,52,0.4)]"
                                                : "bg-white border border-black/20 scale-100"
                                            }`}
                                    >
                                        <div className={`w-1 h-1 rounded-full transition-colors duration-500 ${index <= activeIndex ? "bg-white" : "bg-[#0A4834]/20"
                                            }`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Grid Section - THE HEART */}
                    <div className="flex-1 w-full flex items-center justify-center gap-2 md:gap-6 [perspective:2000px] z-20 mb-4">
                        {timelineItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ${index === activeIndex
                                        ? "w-[65%] md:w-[60%] h-[45vh] md:h-[55vh] opacity-100 scale-100 z-20 ring-1 ring-black/5"
                                        : "w-[8%] md:w-[7%] h-[35vh] md:h-[45vh] opacity-30 grayscale scale-95 z-10"
                                    }`}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className={`object-cover transition-all duration-[2000ms] ${index === activeIndex ? "scale-105" : "scale-125"
                                        }`}
                                />
                                {/* Label inside the active image */}
                                {index === activeIndex && (item.title || item.desc) && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12 animate-in fade-in zoom-in-95 duration-1000">
                                        <div className="mb-2 w-12 h-1 bg-white/30" />
                                        {item.title && <h3 className="text-white font-boldonse text-lg md:text-2xl font-light tracking-tight mb-4">{item.title}</h3>}
                                        {item.desc && <p className="text-white/80 font-mulish text-sm md:text-lg max-w-md leading-relaxed">{item.desc}</p>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}

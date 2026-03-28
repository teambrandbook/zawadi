"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const timelineItems = [
    { id: 1, image: "/home/section4-1.webp", title: "Our Roots", desc: "Starting with a vision to connect everyone to fresh produce." },
    { id: 2, image: "/home/section4-2.webp", title: "Growing Community", desc: "Expanding our network of local farmers and partners." },
    { id: 3, image: "/home/section4-3.webp", title: "Sustainable Future", desc: "Implementing tech for zero-waste agriculture." },
    { id: 4, image: "/home/section5-1.webp", title: "The Road Ahead", desc: "Building a healthier planet, one meal at a time." }
];

export default function Story() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const container = sectionRef.current;
            const containerTop = container.offsetTop;
            const containerHeight = container.offsetHeight;
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            // Progress through the sticky container
            const start = containerTop;
            const end = containerTop + containerHeight - viewportHeight;
            
            let progress = (scrollY - start) / (end - start);
            progress = Math.max(0, Math.min(1, progress));
            
            setScrollProgress(progress);

            // Determine active index with some buffer for better pinning feel
            const itemsCount = timelineItems.length;
            const step = 1 / itemsCount;
            const newIndex = Math.min(Math.floor(progress / step), itemsCount - 1);
            setActiveIndex(newIndex);
        };

        window.addEventListener("scroll", handleScroll);
        // Initial call
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useGSAP(() => {
        // Header Reveal
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".story-header",
                start: "top 85%",
                once: true
            }
        });

        tl.from(".header-item", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative h-[450vh] bg-white">
            {/* Sticky Content Wrapper */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                
                <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-between py-4 px-4 md:px-12">
                    
                    {/* Header Section */}
                    <div className="story-header text-center w-full max-w-4xl z-30">
                        <h2 className="header-item font-display text-4xl md:text-6xl font-black text-[#000000] mb-2 uppercase tracking-tighter">
                            Our Story
                        </h2>
                        <p className="header-item font-sans text-[#555] text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
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
                                width: typeof window !== 'undefined' && window.innerWidth < 768 
                                    ? `calc(${scrollProgress * 83}%)` 
                                    : `calc(${scrollProgress * 91}%)` 
                            }}
                        />

                        <div className="relative z-10 flex justify-between items-center w-full">
                            {timelineItems.map((item, index) => (
                                <div key={item.id} className="relative group p-4 cursor-pointer">
                                    {/* The Circle */}
                                    <div 
                                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-700 ${
                                            index <= activeIndex 
                                            ? "bg-[#0A4834] scale-150 shadow-[0_0_15px_rgba(10,72,52,0.4)]" 
                                            : "bg-white border border-black/20 scale-100"
                                        }`}
                                    >
                                        <div className={`w-1 h-1 rounded-full transition-colors duration-500 ${
                                            index <= activeIndex ? "bg-white" : "bg-[#0A4834]/20"
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
                                className={`relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ${
                                    index === activeIndex 
                                    ? "w-[65%] md:w-[60%] h-[45vh] md:h-[55vh] opacity-100 scale-100 z-20 ring-1 ring-black/5" 
                                    : "w-[8%] md:w-[7%] h-[35vh] md:h-[45vh] opacity-30 grayscale scale-95 z-10"
                                }`}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className={`object-cover transition-all duration-[2000ms] ${
                                        index === activeIndex ? "scale-105" : "scale-125"
                                    }`}
                                />
                                {/* Label inside the active image */}
                                {index === activeIndex && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-12 animate-in fade-in zoom-in-95 duration-1000">
                                        <div className="mb-2 w-12 h-1 bg-white/30" />
                                        <h3 className="text-white font-display text-2xl md:text-4xl font-black uppercase tracking-tight mb-2">{item.title}</h3>
                                        <p className="text-white/80 font-sans text-sm md:text-lg max-w-md leading-relaxed">{item.desc}</p>
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

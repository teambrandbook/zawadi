"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    // SWIPE Reveal for Heading (Left to Right)
    const headingSwipeVariants: any = {
        hidden: { 
            clipPath: "inset(0% 100% 0% 0%)",
            opacity: 0,
            x: -20
        },
        visible: { 
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            x: 0,
            transition: { 
                duration: 1.2, 
                ease: [0.77, 0, 0.175, 1], // Sophisticated ease
                opacity: { duration: 0.4 }
            }
        }
    };

    // FADE IN FROM LEFT for Content
    const contentVariants: any = {
        hidden: { opacity: 0, x: -50 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.8, ease: "circOut" }
        }
    };

    return (
        <section className="w-full bg-white pt-56 pb-12 md:pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                {/* Left Column */}
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-6">
                        {/* Static Heading */}
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-black tracking-tight leading-none uppercase">
                            Zewadi Community
                        </h1>
                        
                        {/* Static Paragraph */}
                        <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed max-w-sm">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                        </p>
                    </div>

                    {/* Image Section - Static */}
                    <div className="w-full aspect-[4/3] relative rounded-sm overflow-hidden shadow-sm group">
                        <Image 
                            src="/community/community-1.webp" 
                            alt="Community Hero Small" 
                            fill 
                            className="object-cover transition-transform duration-[2s] group-hover:scale-105" 
                        />
                    </div>

                    {/* Secondary Text and Button */}
                    <div className="flex flex-col gap-8">
                        <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>

                        <div>
                            <Link
                                href="/contact"
                                className="group w-52 h-14 bg-[#0A4834] rounded-full flex items-center justify-between pl-8 pr-1.5 shadow-xl transition-all hover:bg-[#083a2a] overflow-hidden relative"
                            >
                                <span className="font-sans text-white text-[13px] font-black uppercase tracking-widest relative z-10">
                                    Join Now
                                </span>
                                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#0A4834] shadow-sm relative z-20 transition-transform group-hover:scale-110">
                                    <svg
                                        className="h-5 w-5 md:h-6 md:w-6"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <rect x="3" y="11" width="5" height="2.5" rx="1.25" />
                                        <path d="M10 8c0-1.1 1.2-1.8 2.1-1.3l6.3 3.6c.9.5.9 1.9 0 2.4l-6.3 3.6c-.9.5-2.1-.2-2.1-1.3V8z" />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column - Large Image - Static */}
                <div className="w-full h-full min-h-[500px] lg:min-h-[700px] relative rounded-sm overflow-hidden shadow-sm group">
                    <Image 
                        src="/community/community-2.webp" 
                        alt="Community Hero Large" 
                        fill 
                        className="object-cover transition-transform duration-[2s] group-hover:scale-105" 
                    />
                </div>
            </div>
        </section>
    );
}

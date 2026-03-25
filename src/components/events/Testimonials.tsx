"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Testimonials() {
    return (
        <section className="relative w-full py-24 md:py-36 flex items-center justify-center overflow-hidden bg-white">
            
            {/* 1. BACKGROUND SWIPE ENTRANCE (Matching About Page) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div 
                    initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                    whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                    className="relative w-full h-full"
                >
                    <Image 
                        src="/about/about-6.6.webp" 
                        alt="Testimonials Experience" 
                        fill 
                        priority
                        className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                </motion.div>
            </div>

            {/* Testimonial Module - COMPACT ARTISAN CARDS */}
            <div className="relative z-10 w-full max-w-[80rem] px-6 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-stretch">

                    {/* Left Card - Zoom In (Compact Scale) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="bg-white relative flex min-h-[320px] shadow-2xl rounded-sm overflow-hidden group transition-all duration-700 hover:-translate-y-2"
                    >
                        {/* Navigation Accent Bar (Left) */}
                        <button className="w-10 md:w-14 bg-[#9f8151] flex items-center justify-center cursor-pointer hover:bg-[#866d44] transition-colors shrink-0 outline-none border-none">
                            <span className="text-xl text-white font-light">&lt;</span>
                        </button>

                        {/* Content Area */}
                        <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                            <div className="relative mb-6">
                                <span className="absolute -left-6 -top-6 text-6xl text-[#9f8151]/25 font-serif leading-none">"</span>
                                <p className="font-sans text-black text-sm md:text-base lg:text-lg leading-relaxed font-medium relative z-10">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                </p>
                                <span className="absolute -right-2 -bottom-6 text-6xl text-[#9f8151]/25 font-serif leading-none rotate-180">"</span>
                            </div>

                            {/* Author Attribution */}
                            <div className="flex items-center gap-5 mt-4">
                                <div className="w-14 h-14 bg-[#9f8151] rounded-sm shrink-0 overflow-hidden relative shadow-lg">
                                    <Image src="/about/about.webp" alt="Abdul Hakkem" fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-display font-black text-black text-lg uppercase tracking-tight">Abdul Hakkem</span>
                                    <span className="font-sans text-[#777] text-xs uppercase tracking-widest font-extrabold opacity-70">Our Guest</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Accent Bar (Right - Visible on Mobile only to match user request) */}
                        <button className="lg:hidden w-10 md:w-14 bg-[#9f8151] flex items-center justify-center cursor-pointer hover:bg-[#866d44] transition-colors shrink-0 outline-none border-none">
                            <span className="text-xl text-white font-light">&gt;</span>
                        </button>
                    </motion.div>

                    {/* Right Card - Zoom In Staggered (Compact Scale) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                        className="bg-white relative hidden lg:flex min-h-[320px] shadow-2xl rounded-sm overflow-hidden group transition-all duration-700 hover:-translate-y-2"
                    >
                        {/* Content Area */}
                        <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                            <div className="relative mb-6">
                                <span className="absolute -left-6 -top-6 text-6xl text-[#9f8151]/25 font-serif leading-none">"</span>
                                <p className="font-sans text-black text-sm md:text-base lg:text-lg leading-relaxed font-medium relative z-10">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                </p>
                                <span className="absolute -right-2 -bottom-6 text-6xl text-[#9f8151]/25 font-serif leading-none rotate-180">"</span>
                            </div>

                            {/* Author Attribution */}
                            <div className="flex items-center gap-5 mt-4">
                                <div className="w-14 h-14 bg-[#9f8151] rounded-sm shrink-0 overflow-hidden relative shadow-lg">
                                    <Image src="/about/about.webp" alt="Abdul Hakkem" fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-display font-black text-black text-lg uppercase tracking-tight">Abdul Hakkem</span>
                                    <span className="font-sans text-[#777] text-xs uppercase tracking-widest font-extrabold opacity-70">Our Guest</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Accent Bar (Right) */}
                        <button className="w-10 md:w-14 bg-[#9f8151] flex items-center justify-center cursor-pointer hover:bg-[#866d44] transition-colors shrink-0 outline-none border-none">
                            <span className="text-xl text-white font-light">&gt;</span>
                        </button>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

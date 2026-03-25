"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { imageAnimation, zoomDeepAnimation } from "../../../lib/animations";

export default function Testimonials() {
    useEffect(() => {
        imageAnimation(".img")
        zoomDeepAnimation(".zoomComponent")
    }, [])
    return (
        <section className="relative w-full py-24 px-6 md:px-12 lg:px-24 min-h-[600px] flex items-center justify-center overflow-hidden bg-white">
            
            {/* 1. BACKGROUND SWIPE ENTRANCE (Direct Reveal over white) */}
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
                        alt="Testimonials Background" 
                        fill 
                        className="object-cover brightness-[0.85] transform scale-105" 
                    />
                </motion.div>
            </div>
            
            <div className="relative z-10 w-full max-w-[90rem]">
                {/* 2-Card Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">
                    
                    {/* Testimonial Card 1 - Zoom In Entrance */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="bg-white flex w-full h-auto min-h-[320px] shadow-2xl rounded-sm overflow-hidden"
                    >
                        {/* Left Integrated Nav */}
                        <div className="w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0">
                            <span className="text-2xl text-white font-light">&lt;</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                            <p className="font-sans text-[#333] text-base md:text-lg leading-relaxed font-medium mb-8">
                                “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.”
                            </p>
                            <div className="flex items-center gap-5 mt-auto">
                                <div className="w-14 h-14 bg-[#9F8151] rounded-sm shrink-0 overflow-hidden relative">
                                    <Image src="/about/about.webp" alt="Avatar" fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-display font-bold text-black text-base uppercase tracking-tight leading-none mb-1">Abdul Hakkem</span>
                                    <span className="font-sans text-[#555] text-xs md:text-sm uppercase tracking-wider opacity-80">Our Guest</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Integrated Nav (Visible on Mobile only) */}
                        <div className="lg:hidden w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0">
                            <span className="text-2xl text-white font-light">&gt;</span>
                        </div>
                    </motion.div>

                    {/* Testimonial Card 2 - Zoom In Entrance (Staggered) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                        className="bg-white hidden lg:flex w-full h-auto min-h-[320px] shadow-2xl rounded-sm overflow-hidden"
                    >
                        {/* Content */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                            <p className="font-sans text-[#333] text-base md:text-lg leading-relaxed font-medium mb-8">
                                “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.”
                            </p>
                            <div className="flex items-center gap-5 mt-auto">
                                <div className="w-14 h-14 bg-[#9F8151] rounded-sm shrink-0 overflow-hidden relative">
                                    <Image src="/about/about.webp" alt="Avatar" fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-display font-bold text-black text-base uppercase tracking-tight leading-none mb-1">Abdul Hakkem</span>
                                    <span className="font-sans text-[#555] text-xs md:text-sm uppercase tracking-wider opacity-80">Our Guest</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Integrated Nav */}
                        <div className="w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0">
                            <span className="text-2xl text-white font-light">&gt;</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Testimonials() {
    return (
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 min-h-[600px] flex items-center justify-center overflow-hidden bg-white">
            
            {/* 1. CINEMATIC TOP-TO-BOTTOM SWIPE REVEAL */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div 
                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                    whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                    className="relative w-full h-full"
                >
                    <Image 
                        src="/about/about-6.6.webp" 
                        alt="Testimonials Background" 
                        fill 
                        className="object-cover brightness-[0.7] transform scale-105" 
                    />
                    
                    {/* Vertical Shimmer Edge traveling Top to Bottom */}
                    <motion.div 
                        initial={{ top: "0%" }}
                        whileInView={{ top: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                        className="absolute left-0 right-0 h-[4px] bg-[#EAE3D2] z-30 shadow-[0_0_30px_rgba(234,227,210,0.8)] pointer-events-none"
                    />
                </motion.div>
            </div>
            
            <div className="relative z-10 w-full max-w-[80rem]">
                {/* 2-Card Grid - Double Dialogue Layout (REDUCED SIZE) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">
                    
                    {/* Testimonial Card 1 - Compact Arrival */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.85, y: -20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 1.2, 
                            delay: 1.5, 
                            ease: [0.34, 1.56, 0.64, 1] 
                        }}
                        className="bg-white flex w-full h-auto min-h-[300px] md:min-h-[320px] shadow-2xl rounded-none overflow-hidden"
                    >
                        {/* Left Integrated Nav Bar */}
                        <div className="w-12 md:w-14 lg:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0">
                            <span className="text-xl text-white font-light">&lt;</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center gap-6">
                            <p className="font-sans text-[#444] text-[15px] md:text-lg lg:text-xl leading-relaxed italic font-medium tracking-tight">
                                “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.”
                            </p>
                            <div className="flex items-center gap-5 mt-auto">
                                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#9F8151] rounded-none shrink-0 overflow-hidden relative shadow-md">
                                    <Image src="/about/about.webp" alt="Avatar" fill className="object-cover opacity-90" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-sans font-extrabold text-black text-lg md:text-xl lg:text-xl tracking-tighter uppercase leading-none">Abdul Hakkem</span>
                                    <span className="font-sans text-[#555] text-xs md:text-sm font-bold tracking-widest uppercase opacity-80">Our Guest</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Integrated Nav Bar (Visible on Mobile only) */}
                        <div className="lg:hidden w-12 md:w-14 lg:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0">
                            <span className="text-xl text-white font-light">&gt;</span>
                        </div>
                    </motion.div>

                    {/* Testimonial Card 2 - Compact Arrival (STAGGERED) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 1.2, 
                            delay: 1.8, 
                            ease: [0.34, 1.56, 0.64, 1] 
                        }}
                        className="bg-white hidden lg:flex w-full h-auto min-h-[300px] md:min-h-[320px] shadow-2xl rounded-none overflow-hidden"
                    >
                        {/* Content */}
                        <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center gap-6">
                            <p className="font-sans text-[#444] text-[15px] md:text-lg lg:text-xl leading-relaxed italic font-medium tracking-tight">
                                “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.”
                            </p>
                            <div className="flex items-center gap-5 mt-auto">
                                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#9F8151] rounded-none shrink-0 overflow-hidden relative shadow-md">
                                    <Image src="/about/about.webp" alt="Avatar" fill className="object-cover opacity-90" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-sans font-extrabold text-black text-lg md:text-xl lg:text-xl tracking-tighter uppercase leading-none">Abdul Hakkem</span>
                                    <span className="font-sans text-[#555] text-xs md:text-sm font-bold tracking-widest uppercase opacity-80">Our Guest</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Integrated Nav Bar */}
                        <div className="w-12 md:w-14 lg:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0">
                            <span className="text-xl text-white font-light">&gt;</span>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

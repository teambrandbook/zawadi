"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonialsData = [
    {
        id: 1,
        name: "Abdul Hakkem",
        role: "Our Guest",
        content: "“I was amazed by the quality of the produce. The direct-from-farm approach truly makes a difference in taste and freshness. Highly recommended!”",
        avatar: "/about/about-1.1.webp"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "Chef",
        content: "“As a chef, I only work with the best ingredients. Zewadi's commitment to tech-driven sustainable agriculture ensures I get premium quality consistently.”",
        avatar: "/about/about-2.2.webp"
    },
    {
        id: 3,
        name: "Michael Chen",
        role: "Regular Customer",
        content: "“The transparency in their supply chain is refreshing. Knowing exactly where my food comes from and how it was grown gives me immense peace of mind.”",
        avatar: "/about/about-3.3.webp"
    }
];

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    };

    return (
        <section className="relative w-full py-24 md:py-36 px-6 md:px-12 lg:px-24 flex items-center justify-center overflow-hidden bg-white">
            
            {/* 1. BACKGROUND SWIPE ENTRANCE */}
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
                <div className="flex flex-col items-center">
                    
                    {/* Testimonial Carousel Overlay */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">
                        
                        {/* Current Slide */}
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white flex w-full h-auto min-h-[320px] shadow-2xl rounded-sm overflow-hidden"
                            >
                                {/* Left Integrated Nav */}
                                <button 
                                    onClick={prevSlide}
                                    className="w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0 outline-none border-none"
                                >
                                    <span className="text-2xl text-white font-light">&lt;</span>
                                </button>

                                {/* Content */}
                                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                                    <p className="font-sans text-[#333] text-base md:text-lg leading-relaxed font-medium mb-8 italic">
                                        {testimonialsData[activeIndex].content}
                                    </p>
                                    <div className="flex items-center gap-5 mt-auto">
                                        <div className="w-14 h-14 bg-[#F0E6D2] rounded-sm shrink-0 overflow-hidden relative shadow-md">
                                            <Image 
                                                src={testimonialsData[activeIndex].avatar} 
                                                alt={testimonialsData[activeIndex].name} 
                                                fill 
                                                className="object-cover" 
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-display font-bold text-black text-base md:text-lg uppercase tracking-tight leading-none mb-1">
                                                {testimonialsData[activeIndex].name}
                                            </span>
                                            <span className="font-sans text-[#555] text-xs md:text-sm uppercase tracking-wider opacity-80 font-semibold">
                                                {testimonialsData[activeIndex].role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Next Slide (Preview for Desktop) */}
                        <motion.div 
                            key={(activeIndex + 1) % testimonialsData.length}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white hidden lg:flex w-full h-auto min-h-[320px] shadow-2xl rounded-sm overflow-hidden opacity-90"
                        >
                            {/* Content */}
                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                                <p className="font-sans text-[#333] text-base md:text-lg leading-relaxed font-medium mb-8 italic">
                                    {testimonialsData[(activeIndex + 1) % testimonialsData.length].content}
                                </p>
                                <div className="flex items-center gap-5 mt-auto">
                                    <div className="w-14 h-14 bg-[#F0E6D2] rounded-sm shrink-0 overflow-hidden relative shadow-md">
                                        <Image 
                                            src={testimonialsData[(activeIndex + 1) % testimonialsData.length].avatar} 
                                            alt={testimonialsData[(activeIndex + 1) % testimonialsData.length].name} 
                                            fill 
                                            className="object-cover" 
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-display font-bold text-black text-base md:text-lg uppercase tracking-tight leading-none mb-1">
                                            {testimonialsData[(activeIndex + 1) % testimonialsData.length].name}
                                        </span>
                                        <span className="font-sans text-[#555] text-xs md:text-sm uppercase tracking-wider opacity-80 font-semibold">
                                            {testimonialsData[(activeIndex + 1) % testimonialsData.length].role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Integrated Nav */}
                            <button 
                                onClick={nextSlide}
                                className="w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0 outline-none border-none"
                            >
                                <span className="text-2xl text-white font-light">&gt;</span>
                            </button>
                        </motion.div>

                    </div>
                    
                    {/* Pagination Dots */}
                    <div className="flex gap-2 mt-12">
                        {testimonialsData.map((_, i) => (
                            <div 
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    i === activeIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                                }`}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}

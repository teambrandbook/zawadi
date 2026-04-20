"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { imageAnimation, zoomDeepAnimation } from "../../../lib/animations";

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

    useEffect(() => {
        imageAnimation(".img")
        zoomDeepAnimation(".zoomComponent")
    }, [])

    return (
        <section className="relative mx-4 md:mx-10 lg:mx-10 px-6 md:px-10 lg:px-16 py-24 md:py-36 flex items-center justify-center overflow-hidden">

            {/* Background */}
            <div className="img rounded-[10px] absolute inset-0 z-0 overflow-hidden">
                <div className="relative w-full h-full">
                    <Image
                        src="/about/about-6.6.webp"
                        alt="Testimonials Background"
                        fill
                        className="object-cover brightness-[0.85] transform scale-105"
                    />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-[90rem]">
                <div className="flex flex-col items-center">

                    {/* Carousel */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">
                        {[activeIndex, (activeIndex + 1) % testimonialsData.length].map((index, i) => {
                            const item = testimonialsData[index]

                            return (
                                <div
                                    key={index}
                                    className={`zoomComponent bg-white flex w-full h-auto min-h-[320px] shadow-2xl rounded-sm overflow-hidden 
                                    ${i === 1 ? "hidden lg:flex opacity-90" : ""}`}
                                >
                                    {/* LEFT BUTTON */}
                                    {i === 0 && (
                                        <button
                                            onClick={prevSlide}
                                            className="w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0"
                                        >
                                            <span className="text-2xl text-white">&lt;</span>
                                        </button>
                                    )}

                                    {/* CONTENT */}
                                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                                        <p className="font-mulish text-[#333] text-base md:text-lg leading-relaxed font-medium mb-8 italic">
                                            {item.content}
                                        </p>

                                        <div className="flex items-center gap-5 mt-auto">
                                            <div className="w-14 h-14 bg-[#F0E6D2] rounded-sm overflow-hidden relative shadow-md">
                                                <Image
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="font-display font-light text-black text-sm md:text-base mb-1">
                                                    {item.name}
                                                </span>
                                                <span className="font-mulish text-[#555] text-xs md:text-sm uppercase opacity-80 font-semibold">
                                                    {item.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT BUTTON */}
                                    {i === 1 && (
                                        <button
                                            onClick={nextSlide}
                                            className="w-12 md:w-16 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0"
                                        >
                                            <span className="text-2xl text-white">&gt;</span>
                                        </button>
                                    )}

                                    {/* ✅ NEW: RIGHT BUTTON FOR MOBILE */}
                                    {i === 0 && (
                                        <button
                                            onClick={nextSlide}
                                            className="flex lg:hidden w-12 bg-[#9F8151] items-center justify-center cursor-pointer hover:bg-[#8A6E42] transition-colors shrink-0"
                                        >
                                            <span className="text-2xl text-white">&gt;</span>
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Dots */}
                    <div className="flex gap-2 mt-12">
                        {testimonialsData.map((_, i) => (
                            <div className="zoomComponent" key={i}>
                                <div
                                    onClick={() => setActiveIndex(i)}
                                    className={`h-3 w-3 rounded-full cursor-pointer ${i === activeIndex ? "bg-white" : "bg-white/40"}`}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
"use client";

import Image from "next/image";
import { useEffect } from "react";
import { fadeUp } from "../../../lib/animations";

export default function Hero() {
    useEffect(()=>{
        fadeUp(".fadeComponnent")
    },[])
    return (
        <section className="w-full bg-white pt-42 px-4 md:px-8 lg:px-12">
            <div className="fadeComponnent w-full max-w-[90rem] mx-auto bg-[#0A4834] rounded-[2rem] relative overflow-hidden h-[750px] md:h-[850px] flex flex-col items-center pt-24 md:pt-36">

                {/* Centered Text Content */}
                <div className="w-full max-w-4xl px-6 text-center z-10 mb-12">
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 tracking-tight leading-[0.9]">
                        Quick Answers to Common Questions
                    </h1>
                    <p className="font-sans text-white/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </p>
                </div>

                {/* Image Box - Centered as requested */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[85%] md:w-[600px] h-[200px] md:h-[280px] bg-[#D9D9D9] rounded-2xl shadow-2xl overflow-hidden">
                    <Image src="/recipe/recipe-2.webp" alt="FAQ Hero" fill className="object-cover" />
                </div>

            </div>
        </section>
    );
}

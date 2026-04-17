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
            <div className="fadeComponnent w-full max-w-[90rem] mx-auto bg-[#0A4834] rounded-[1rem] relative overflow-hidden h-[750px] md:h-[750px] flex flex-col items-center pt-24 md:pt-36">

                {/* Centered Text Content */}
                <div className="w-full max-w-4xl px-6 text-center z-10 mb-20">
                    <h1 className="font-display text-4xl md:text-3xl lg:text-5xl font-light text-white mb-10 -mt-20 tracking-tight leading-[1.5]">
                        Quick Answers to Common Questions
                    </h1>
                    <p className="font-mulish text-white/80 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                        Bridging the gap between technology and agriculture to redefine your food experience.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </p>
                </div>

                {/* Image Box - Centered as requested */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[85%] md:w-[600px] h-[200px] md:h-[280px] bg-[#D9D9D9] rounded-2xl shadow-2xl overflow-hidden">
                    <Image src="/recipe/recipe-2.webp" alt="FAQ Hero" fill className="object-cover" />
                </div>

            </div>
        </section>
    );
}

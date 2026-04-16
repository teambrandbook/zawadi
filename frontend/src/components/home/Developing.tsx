"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import WipeButton from "../shared/WipeButton";

export default function Developing() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Header Reveal
        const headerTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".dev-header",
                start: "top 85%",
                once: true
            }
        });

        headerTl.from(".header-item", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.2,
            ease: "circ.out"
        });

        // Left Column Reveal
        const leftTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".dev-left",
                start: "top 85%",
                once: true
            }
        });

        leftTl.from(".left-image-wipe", {
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            scale: 1.05,
            duration: 1.2,
            ease: "power3.inOut"
        })
        .from(".left-button", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "circ.out"
        }, "-=0.6");

        // Right Column Reveal
        const rightTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".dev-right",
                start: "top 85%",
                once: true
            }
        });

        rightTl.from(".right-image-wipe", {
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            scale: 1.05,
            duration: 1.2,
            ease: "power3.inOut"
        })
        .from(".right-text", {
            opacity: 0,
            x: -50,
            duration: 1,
            ease: "circ.out"
        }, "-=0.8");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full bg-white py-12 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Header Section */}
                <div className="dev-header text-center max-w-4xl mb-20 flex flex-col items-center gap-6">
                    <h2 className="header-item font-display text-5xl md:text-7xl font-bold text-[#000000] tracking-tight leading-tight">
                        Where Every Meal Becomes a Memory
                    </h2>
                    <p className="header-item font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-3xl">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* Left Column: Tall Image + Pill Toggle */}
                    <div className="dev-left flex flex-col gap-10">
                        <div className="left-image-wipe w-full aspect-[3/4] relative bg-[#f5f5f5] rounded-sm overflow-hidden shadow-sm group">
                            <Image
                                src="/home/section5-1.webp"
                                alt="Meal memory vertical"
                                fill
                                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                        </div>

                        <div className="left-button">
                            <WipeButton href="/community" label="Explore More" />
                        </div>
                    </div>

                    {/* Right Column: Wide Image + Descriptive Text */}
                    <div className="dev-right flex flex-col gap-10">
                        <div className="right-image-wipe w-full aspect-[4/3] relative bg-[#f5f5f5] rounded-sm overflow-hidden shadow-sm group">
                            <Image
                                src="/home/section5-2.webp"
                                alt="Meal memory horizontal"
                                fill
                                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                        </div>
                        <p className="right-text font-sans text-[#555] text-sm md:text-[15px] leading-relaxed max-w-xl">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

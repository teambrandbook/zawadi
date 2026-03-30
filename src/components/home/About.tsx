"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import WipeButton from "../shared/WipeButton";

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Row 1 Reveal
        const row1 = gsap.timeline({
            scrollTrigger: {
                trigger: ".about-row-1",
                start: "top 85%",
                once: true
            }
        });

        row1.from(".row-1-text", {
            opacity: 0,
            x: -50,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        })
        .from(".row-1-image", {
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            scale: 1.05,
            duration: 1.2,
            ease: "power3.inOut"
        }, "-=0.6");

        // Row 2 Reveal
        const row2 = gsap.timeline({
            scrollTrigger: {
                trigger: ".about-row-2",
                start: "top 85%",
                once: true
            }
        });

        row2.from(".row-2-image", {
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            scale: 1.05,
            duration: 1.2,
            stagger: 0.2,
            ease: "power3.inOut"
        })
        .from(".row-2-text", {
            opacity: 0,
            x: -50,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.8")
        .from(".row-2-button", {
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6");

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full bg-white lg:py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-24 md:gap-32">

                {/* Row 1: Text Left, Large Image Right */}
                <div className="about-row-1 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 items-center">
                    <div className="flex flex-col gap-6 order-1">
                        <h2 className="row-1-text font-display text-5xl md:text-7xl font-black text-black leading-tight uppercase tracking-tighter">
                            Zewadi Community
                        </h2>
                        <p className="row-1-text font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-md">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                        </p>
                    </div>

                    <div className="row-1-image relative aspect-[16/11] w-full bg-[#f0f0f0] rounded-sm overflow-hidden shadow-sm order-2 group">
                        <Image
                            src="/home/section2-3.webp"
                            alt="Zewadi Community Activities"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Row 2: Two Vertical Images Left, Headline & Button Right */}
                <div className="about-row-2 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 items-center">
                    <div className="flex gap-4 md:gap-6 order-2 md:order-1 h-80 md:h-[28rem]">
                        <div className="row-2-image relative w-1/2 rounded-sm overflow-hidden shadow-sm group">
                            <Image
                                src="/home/section2-1.webp"
                                alt="Fresh market produce"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <div className="row-2-image relative w-1/2 rounded-sm overflow-hidden shadow-sm group">
                            <Image
                                src="/home/section2-2.webp"
                                alt="Zewadi customer or partner"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-10 order-1 md:order-2 items-start">
                        <div className="flex flex-col gap-6">
                            <h3 className="row-2-text font-display text-4xl md:text-6xl font-black text-black leading-[1.1] tracking-tighter">
                                Eat Fresh. <br className="md:hidden" /> Live Well.
                            </h3>
                            <p className="row-2-text font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-[400px]">
                                Redefining your food experience with technology and sustainable agriculture. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                        <div className="row-2-button">
                            <WipeButton href="/community" label="Explore More" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

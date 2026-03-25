"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const slides = [
    {
        id: 1,
        image: "/about/about-3.3.webp",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    },
    {
        id: 2,
        image: "/about/about-4.4.webp",
        desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit."
    },
    {
        id: 3,
        image: "/about/about-2.2.webp",
        desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."
    },
];

export default function StoryCarousel() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 40,
        mass: 0.5
    });

    // Sync active index for content 
    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (v) => {
            const index = Math.min(Math.floor(v * (slides.length + 0.1)), slides.length - 1);
            setActiveIndex(index);
        });
        return () => unsubscribe();
    }, [smoothProgress]);

    return (
        <section ref={sectionRef} className="relative h-[500vh] bg-[#0A4834]">
            {/* Sticky 100vh Hub */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* 1. Header Area - High-Locked to periphery as requested */}
                <div className="absolute top-16 md:top-18 lg:top-10 z-[100] text-center w-full max-w-4xl px-6">
                    <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-[#EAE3D2] tracking-tighter leading-[0.85]">
                        The story behind the <br /> flavors
                    </h2>
                </div>

                {/* 2. Interactive Image Gallery Area - Focused Center Stage */}
                <div className="relative w-full flex items-center justify-center z-20 px-6 top-5">
                    <div className="relative w-full h-[28rem] md:h-[38rem] lg:h-[32rem] flex items-center justify-center">
                        {slides.map((slide, index) => (
                            <StoryImageStackCard
                                key={slide.id}
                                slide={slide}
                                index={index}
                                progress={smoothProgress}
                            />
                        ))}
                    </div>
                </div>

                {/* 3. Narrative Text Sync Area - Grounded at Absolute Bottom */}
                <div className="absolute bottom-10 md:bottom-16 lg:bottom-5 z-[100] w-full max-w-5xl px-6 text-center min-h-[5rem] flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {slides.map((slide, index) => {
                            const pStart = index / slides.length;
                            const pEnd = (index + 1) / slides.length;

                            return (
                                <motion.p
                                    key={`desc-${slide.id}`}
                                    className="absolute inset-x-0 font-sans text-[#EAE3D2] text-sm md:text-lg lg:text-xl leading-relaxed font-light opacity-80"
                                    style={{
                                        opacity: useTransform(
                                            smoothProgress,
                                            [pStart - 0.15, pStart, pEnd - 0.15, pEnd],
                                            [0, 1, 1, 0]
                                        ),
                                        y: useTransform(
                                            smoothProgress,
                                            [pStart - 0.15, pStart, pEnd - 0.15, pEnd],
                                            [10, 0, 0, -10]
                                        ),
                                        visibility: useTransform(
                                            smoothProgress,
                                            [pStart - 0.15, pStart, pEnd],
                                            ["hidden", "visible", "hidden"]
                                        ) as any
                                    }}
                                >
                                    {slide.desc}
                                </motion.p>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}

function StoryImageStackCard({ slide, index, progress }: { slide: any, index: number, progress: any }) {
    const total = slides.length;
    const turn = index / total;
    const nextTurn = (index + 1) / total;
    const transitionWindow = 0.15;

    const xPos = useTransform(
        progress,
        [turn, nextTurn - transitionWindow, nextTurn - (transitionWindow / 2), nextTurn, 1],
        ["0px", "0px", "-500px", "0px", "0px"]
    );

    const scale = useTransform(
        progress,
        [0, turn - transitionWindow, turn, nextTurn - transitionWindow, nextTurn, 1],
        [0.88, 0.88, 1, 1, 0.88, 0.88]
    );

    const opacity = useTransform(
        progress,
        [turn - (transitionWindow * 2), turn, nextTurn - transitionWindow, nextTurn - (transitionWindow / 2), nextTurn, 1],
        [0.4, 1, 1, 0, 0.4, 0.4]
    );

    const zIndex = useTransform(
        progress,
        [turn - 0.02, turn, nextTurn - 0.02, nextTurn],
        [10, 50, 50, 10]
    );

    const rotate = useTransform(
        progress,
        [nextTurn - transitionWindow, nextTurn - (transitionWindow / 2), nextTurn],
        [0, -10, 0]
    );

    return (
        <motion.div
            style={{
                x: xPos,
                rotate,
                scale,
                opacity,
                zIndex,
                position: "absolute"
            }}
            className="w-[20rem] h-[24rem] md:w-[30rem] md:h-[34rem] lg:w-[28rem] lg:h-[26rem] shadow-[0_45px_100px_-25px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden bg-black ring-1 ring-white/10"
        >
            <Image
                src={slide.image}
                alt={`Story card ${index}`}
                fill
                className="object-cover"
                priority={index === 0}
            />
        </motion.div>
    );
}

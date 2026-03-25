"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import WipeButton from "../shared/WipeButton";

const eventItems = [
    {
        id: 1,
        title: "Where Every Meal Becomes a Memory",
        desc: "Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        image: "/home/section7-1.webp"
    },
    {
        id: 2,
        title: "Where Every Meal Becomes a Memory",
        desc: "Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        image: "/home/section7-2.webp"
    },
    {
        id: 3,
        title: "Where Every Meal Becomes a Memory",
        desc: "Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        image: "/home/section5-1.webp"
    },
    {
        id: 4,
        title: "Where Every Meal Becomes a Memory",
        desc: "Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
        image: "/home/section5-2.webp"
    }
];

export default function Events() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 45, // Smoother, professional pacing
        damping: 30,
        mass: 0.8
    });

    const containerHeight = "70vh"; // Slightly shorter container
    const p0 = "28px";
    const p3 = `calc(${containerHeight} - 28px)`;
    const totalGapVal = `calc(${p3} - ${p0})`;

    const p1 = `calc(${p0} + (${totalGapVal} * 1 / 3))`;
    const p2 = `calc(${p0} + (${totalGapVal} * 2 / 3))`;
    const nodeCenters = [p0, p1, p2, p3];

    // Professional 'Pro-Stop' Mapping: [Dwell, Move, Dwell, Move, Dwell, Move, Dwell]
    const PROGRESS_STOPS = [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 1.0];

    // Indicator position - perfectly synced to stops
    const indicatorY = useTransform(smoothProgress, PROGRESS_STOPS, [p0, p0, p1, p1, p2, p2, p3, p3], { clamp: true });

    // Discrete Progress Segments: one stop after the other
    const segments = [
        { start: 0.15, end: 0.25 }, // Move 1->2
        { start: 0.4, end: 0.5 },   // Move 2->3
        { start: 0.65, end: 0.75 }  // Move 3->4
    ];

    const cardH = 420;
    const cardTranslation = useTransform(
        smoothProgress,
        PROGRESS_STOPS,
        ["0px", "0px", `-${cardH}px`, `-${cardH}px`, `-${cardH * 2}px`, `-${cardH * 2}px`, `-${cardH * 3}px`, `-${cardH * 3}px`],
        { clamp: true }
    );

    return (
        <section ref={containerRef} className="relative h-[600vh] bg-white">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="max-w-[85rem] w-full mx-auto grid grid-cols-12 md:gap-8 lg:gap-16 px-6 md:px-12 lg:px-24 h-auto lg:h-[75vh] items-start lg:items-center pt-12 lg:pt-0">

                    {/* Left Column */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col justify-center gap-10 z-20 max-w-[440px] md:max-w-none mx-auto w-full">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                        >
                            <h2 className="font-display text-5xl md:text-6xl font-black text-[#0A4834] mb-6 uppercase tracking-tighter leading-[0.85]">
                                Where Every Meal <br /> Becomes a Memory
                            </h2>
                            <p className="font-sans text-[#555] text-base md:text-lg leading-relaxed max-w-sm mb-8">
                                Redefine your food experience with technology and sustainable agriculture.
                            </p>
                            <WipeButton href="/events" label="Explore More" />
                        </motion.div>
                    </div>

                    {/* Middle Column */}
                    <div className="hidden lg:flex lg:col-span-1 relative h-[70vh] flex-col items-center justify-center">
                        <div className="h-full w-full relative overflow-hidden">
                            {/* Segmented Background */}
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={`bg-seg-${i}`}
                                    className="absolute left-1/2 -translate-x-1/2 bg-[#F0F0F0] z-0"
                                    style={{
                                        top: nodeCenters[i],
                                        height: `calc(${totalGapVal} / 3)`,
                                        width: "3px"
                                    }}
                                />
                            ))}

                            {/* Segmented Filling Progress */}
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={`active-seg-${i}`}
                                    className="absolute left-1/2 -translate-x-1/2 bg-[#0A4834] z-10 origin-top"
                                    style={{
                                        top: nodeCenters[i],
                                        width: "3px",
                                        height: useTransform(
                                            smoothProgress,
                                            [segments[i].start, segments[i].end],
                                            ["0%", "100%"],
                                            { clamp: true }
                                        )
                                    } as any}
                                />
                            ))}

                            {nodeCenters.map((centerPos, i) => (
                                <motion.div key={i} className="absolute left-1/2 w-10 h-10 z-20" style={{ top: centerPos, x: "-50%", y: "-50%" } as any}>
                                    <motion.div
                                        className="w-full h-full rounded-full bg-white border border-[#E0E0E0] flex items-center justify-center shadow-md"
                                        style={{
                                            borderColor: useTransform(
                                                smoothProgress,
                                                [PROGRESS_STOPS[i * 2] - 0.05, PROGRESS_STOPS[i * 2], PROGRESS_STOPS[i * 2] + 0.05],
                                                ["#E0E0E0", "#0A4834", "#E0E0E0"],
                                                { clamp: true }
                                            )
                                        } as any}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-[#E0E0E0]" />
                                    </motion.div>
                                </motion.div>
                            ))}
                            <motion.div className="absolute left-1/2 z-40 w-10 h-10 rounded-full bg-[#0A4834] border-[2px] border-white shadow-lg flex items-center justify-center pointer-events-none" style={{ top: indicatorY, x: "-50%", y: "-50%" } as any}>
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column: Sliding Event Cards */}
                    <div className="col-span-12 lg:col-span-6 flex flex-col relative h-[420px] overflow-hidden items-center max-w-[440px] md:max-w-none mx-auto w-full pt-16 lg:pt-0">
                        <motion.div
                            className="w-full flex flex-col items-center"
                            style={{ y: cardTranslation } as any}
                        >
                            {eventItems.map((item, index) => (
                                <EventCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    progress={smoothProgress}
                                    height={cardH}
                                />
                            ))}
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}

function EventCard({ item, index, progress, height }: { item: any, index: number, progress: any, height: number }) {
    // Pro-Stop Mapping: [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 1.0]

    // Stop pairs for each item dwell state
    const dwells = [[0, 0.15], [0.25, 0.4], [0.5, 0.65], [0.75, 1.0]];
    const fadeIns = [-0.1, 0.15, 0.4, 0.65];
    const fadeOuts = [0.25, 0.5, 0.75, 1.1];

    const opacity = useTransform(
        progress,
        [fadeIns[index], dwells[index][0], dwells[index][1], fadeOuts[index]],
        [0, 1, 1, 0],
        { clamp: true }
    );
    const scale = useTransform(
        progress,
        [fadeIns[index], dwells[index][0], dwells[index][1], fadeOuts[index]],
        [0.9, 1, 1, 0.9],
        { clamp: true }
    );
    const visibility = useTransform(
        progress,
        [fadeIns[index], dwells[index][0], dwells[index][1], fadeOuts[index]],
        ["hidden", "visible", "visible", "hidden"],
        { clamp: true }
    );

    return (
        <motion.div
            style={{ opacity, scale, visibility: visibility as any, height: height } as any}
            className="w-full flex-shrink-0 flex flex-col justify-center bg-[#f5f5f5] py-8 px-6 md:px-8 rounded-sm shadow-xl border border-black/5"
        >
            <div className="w-full max-w-lg mx-auto">
                <h3 className="font-display text-lg md:text-xl lg:text-2xl font-black text-black mb-3 uppercase tracking-tighter leading-tight">
                    {item.title}
                </h3>
                <p className="font-sans text-[13px] text-[#555] mb-6 leading-relaxed line-clamp-2">
                    {item.desc}
                </p>
                <div className="w-full aspect-video relative rounded-sm overflow-hidden shadow-inner group">
                    <Image
                        fill
                        src={item.image}
                        alt={item.title}
                        className="object-cover transition-transform duration-[2s] scale-100 group-hover:scale-105"
                    />
                </div>
            </div>
        </motion.div>
    );
}

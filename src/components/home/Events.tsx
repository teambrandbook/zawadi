"use client";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WipeButton from "../shared/WipeButton";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

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
    const indicatorRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const cardContainerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !indicatorRef.current || !cardContainerRef.current) return;

        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 1024px)",
            isTablet: "(min-width: 768px) and (max-width: 1023px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            const { isDesktop, isTablet } = context.conditions as any;

            // Align precisely with the CSS heights
            const cardH = isDesktop ? 420 : (isTablet ? 400 : 360);

            // Left Column Reveal
            gsap.from(".events-left-content", {
                opacity: 0,
                x: -30,
                duration: 1,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: ".events-left-content",
                    start: "top 85%",
                    once: true
                }
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            });

            const scrollPoints = {
                dwell1: 0,
                move1: 0.15,
                stop1: 0.25,
                dwell2: 0.25,
                move2: 0.4,
                stop2: 0.5,
                dwell3: 0.5,
                move3: 0.65,
                stop3: 0.75,
                last: 1.0
            };

            // Stage 0: Initialization
            tl.set(indicatorRef.current, { top: "0%" });
            tl.set(cardContainerRef.current, { y: 0 });

            // Transition 1: Target Node 1 (33.33%)
            tl.to(lineRefs.current[0], { scaleY: 1, duration: 0.1, ease: "none" }, scrollPoints.move1);
            tl.to(indicatorRef.current, { top: "33.33%", duration: 0.1, ease: "none" }, scrollPoints.move1);
            tl.to(cardContainerRef.current, { y: -cardH, duration: 0.1, ease: "none" }, scrollPoints.move1);
            tl.to(nodeRefs.current[1], { borderColor: "#0A4834", duration: 0.02 }, scrollPoints.stop1);

            // Transition 2: Target Node 2 (66.66%)
            tl.to(lineRefs.current[1], { scaleY: 1, duration: 0.1, ease: "none" }, scrollPoints.move2);
            tl.to(indicatorRef.current, { top: "66.66%", duration: 0.1, ease: "none" }, scrollPoints.move2);
            tl.to(cardContainerRef.current, { y: -cardH * 2, duration: 0.1, ease: "none" }, scrollPoints.move2);
            tl.to(nodeRefs.current[2], { borderColor: "#0A4834", duration: 0.02 }, scrollPoints.stop2);

            // Transition 3: Target Node 3 (100%)
            tl.to(lineRefs.current[2], { scaleY: 1, duration: 0.1, ease: "none" }, scrollPoints.move3);
            tl.to(indicatorRef.current, { top: "100%", duration: 0.1, ease: "none" }, scrollPoints.move3);
            tl.to(cardContainerRef.current, { y: -cardH * 3, duration: 0.1, ease: "none" }, scrollPoints.move3);
            tl.to(nodeRefs.current[3], { borderColor: "#0A4834", duration: 0.02 }, scrollPoints.stop3);

            // Maintain final state during the last 25% of scroll
            tl.to(indicatorRef.current, { top: "100%", duration: 0.25 }, scrollPoints.stop3);
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-[600vh] bg-white">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="max-w-[85rem] w-full mx-auto grid grid-cols-12 md:gap-8 lg:gap-16 px-6 md:px-12 lg:px-24 h-full md:h-auto lg:h-[75vh] items-center lg:items-center py-10 lg:py-0">

                    {/* Left Column - LEFT ALIGNED FOR ALL VIEWPORTS */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col justify-center gap-8 md:gap-10 z-20 max-w-[440px] md:max-w-none w-full text-left">
                        <div className="events-left-content">
                            <h2 className="font-display text-4xl md:text-6xl lg:text-6xl font-black text-[#0A4834] mb-4 md:mb-6 uppercase tracking-tighter leading-[0.9]">
                                Where Every Meal <br /> Becomes a Memory
                            </h2>
                            <p className="font-sans text-[#555] text-base md:text-xl lg:text-lg leading-relaxed max-w-sm md:max-w-2xl mb-6 md:mb-8 ">
                                Redefine your food experience with technology and sustainable agriculture.
                            </p>
                            <div className="flex justify-start">
                                <WipeButton href="/events" label="Explore More" />
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Hidden on Mobile/Tab for clean story flow */}
                    <div className="hidden lg:flex lg:col-span-1 relative h-[70vh] flex-col items-center justify-start py-[28px]">
                        <div className="h-full w-[40px] relative">
                            {/* Segmented Track */}
                            {[0, 1, 2].map((i) => {
                                const top = `${33.33 * i}%`;
                                return (
                                    <div key={`track-${i}`} className="absolute left-[18.5px] w-[3px] bg-[#F0F0F0]" style={{ top, height: "33.33%" }}>
                                        {/* Filling Segment Driven by GSAP */}
                                        <div
                                            ref={el => { lineRefs.current[i] = el; }}
                                            className="w-full h-full bg-[#0A4834] origin-top scale-y-0"
                                        />
                                    </div>
                                );
                            })}

                            {/* Nodes Stage */}
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={`node-${i}`}
                                    ref={el => { nodeRefs.current[i] = el; }}
                                    className={`absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border flex items-center justify-center shadow-md z-20 transition-colors duration-500`}
                                    style={{
                                        top: `${33.33 * i}%`,
                                        transform: "translateY(-50%)",
                                        borderColor: i === 0 ? "#0A4834" : "#E0E0E0" // 0 is always active
                                    }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-[#E0E0E0]" />
                                </div>
                            ))}

                            {/* Floating Indicator Point - THE GREEN BUTTON */}
                            <div
                                ref={indicatorRef}
                                className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0A4834] border-[2px] border-white shadow-lg flex items-center justify-center z-40 pointer-events-none"
                                style={{ top: "0%", transform: "translateY(-50%)" }}
                            >
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sliding Event Cards - Responsive Translation stage */}
                    <div className="col-span-12 lg:col-span-6 flex flex-col relative h-[360px] md:h-[400px] lg:h-[420px] overflow-hidden items-center max-w-[440px] md:max-w-none mx-auto w-full mt-12 md:mt-20 lg:mt-0">
                        <div
                            ref={cardContainerRef}
                            className="w-full flex flex-col items-center"
                        >
                            {eventItems.map((item, index) => (
                                <EventCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

function EventCard({ item, index }: { item: any, index: number }) {
    // Responsive Dimensions for Card Discovery
    return (
        <div
            className="w-full h-[360px] md:h-[400px] lg:h-[420px] flex-shrink-0 flex flex-col justify-center bg-[#f5f5f5] py-6 md:py-8 px-5 md:px-8 rounded-sm shadow-xl border border-black/5"
        >
            <div className="w-full max-w-lg mx-auto">
                <h3 className="font-display text-base md:text-lg lg:text-2xl font-black text-black mb-2 md:mb-3 uppercase tracking-tighter leading-tight">
                    {item.title}
                </h3>
                <p className="font-sans text-[12px] md:text-[13px] text-[#555] mb-4 md:mb-6 leading-relaxed line-clamp-2">
                    {item.desc}
                </p>
                <div className="w-full aspect-[16/8] relative rounded-sm overflow-hidden shadow-inner group">
                    <Image
                        fill
                        src={item.image}
                        alt={item.title}
                        className="object-cover transition-transform duration-[2s] scale-100 group-hover:scale-105"
                    />
                </div>
            </div>
        </div>
    );
}

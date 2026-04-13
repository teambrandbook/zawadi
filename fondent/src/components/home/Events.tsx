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
        desc: "Bridging the gap between technology and agriculture to redefine your food experience.",
        image: "/home/section7-1.webp"
    },
    {
        id: 2,
        title: "Where Every Meal Becomes a Memory",
        desc: "Bridging the gap between technology and agriculture to redefine your food experience.",
        image: "/home/section7-2.webp"
    },
    {
        id: 3,
        title: "Where Every Meal Becomes a Memory",
        desc: "Bridging the gap between technology and agriculture to redefine your food experience.",
        image: "/home/section5-1.webp"
    },
    {
        id: 4,
        title: "Where Every Meal Becomes a Memory",
        desc: "Bridging the gap between technology and agriculture to redefine your food experience.",
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
            const cardH = isDesktop ? 420 : (isTablet ? 400 : 360);

            // ✅ FIX: delayed animation
            const leftEl = containerRef.current?.querySelector(".events-left-content");

            if (leftEl) {
                gsap.delayedCall(0.1, () => {
                    gsap.from(leftEl, {
                        opacity: 0,
                        x: -30,
                        duration: 1,
                        ease: "power3.inOut",
                        scrollTrigger: {
                            trigger: leftEl,
                            start: "top top",
                            once: true
                        }
                    });
                });
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                }
            });

            const scrollPoints = {
                move1: 0.15,
                stop1: 0.25,
                move2: 0.4,
                stop2: 0.5,
                move3: 0.65,
                stop3: 0.75,
            };

            tl.set(indicatorRef.current, { top: "0%" });
            tl.set(cardContainerRef.current, { y: 0 });

            // 🔹 Transition 1
            tl.to(lineRefs.current[0], { scaleY: 1, duration: 0.1 }, scrollPoints.move1);
            tl.to(indicatorRef.current, { top: "33.33%", duration: 0.1 }, scrollPoints.move1);
            tl.to(cardContainerRef.current, { y: -cardH, duration: 0.1 }, scrollPoints.move1);
            tl.to(nodeRefs.current[1], { borderColor: "#0A4834", backgroundColor: "#0A4834" }, scrollPoints.stop1);

            // 🔹 Transition 2
            tl.to(lineRefs.current[1], { scaleY: 1, duration: 0.1 }, scrollPoints.move2);
            tl.to(indicatorRef.current, { top: "66.66%", duration: 0.1 }, scrollPoints.move2);
            tl.to(cardContainerRef.current, { y: -cardH * 2, duration: 0.1 }, scrollPoints.move2);
            tl.to(
                [nodeRefs.current[1], nodeRefs.current[2]],
                { borderColor: "#0A4834", backgroundColor: "#0A4834" },
                scrollPoints.stop2
            );

            // 🔹 Transition 3
            tl.to(lineRefs.current[2], { scaleY: 1, duration: 0.1 }, scrollPoints.move3);
            tl.to(indicatorRef.current, { top: "100%", duration: 0.1 }, scrollPoints.move3);
            tl.to(cardContainerRef.current, { y: -cardH * 3, duration: 0.1 }, scrollPoints.move3);
            tl.to(
                [nodeRefs.current[1], nodeRefs.current[2], nodeRefs.current[3]],
                { borderColor: "#0A4834", backgroundColor: "#0A4834" },
                scrollPoints.stop3
            );

            tl.to(indicatorRef.current, { top: "100%", duration: 0.25 }, scrollPoints.stop3);
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-white">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="max-w-[85rem] w-full mx-auto grid grid-cols-12 md:gap-8 lg:gap-16 px-6 md:px-12 lg:px-24 h-full md:h-auto lg:h-[75vh] items-center py-10 lg:py-0">

                    {/* LEFT */}
                    <div className="col-span-12 lg:col-span-5 flex flex-col justify-center gap-8 md:gap-10 z-20 max-w-[440px] w-full text-left">
                        <div className="events-left-content">
                            <h2 className="font-display text-4xl md:text-6xl lg:text-6xl font-black text-[#0A4834] mb-4 uppercase tracking-tighter leading-[0.9]">
                                Where Every Meal <br /> Becomes a Memory
                            </h2>
                            <p className="font-sans text-[#555] text-base md:text-xl lg:text-lg leading-relaxed max-w-sm mb-6">
                                Redefine your food experience with technology and sustainable agriculture.
                            </p>
                            <div className="flex justify-start">
                                <WipeButton href="/events" label="Explore More" />
                            </div>
                        </div>
                    </div>

                    {/* TIMELINE */}
                    <div className="hidden lg:flex lg:col-span-1 relative h-[70vh] flex-col items-center py-[28px]">
                        <div className="h-full w-[40px] relative">

                            {[0, 1, 2].map((i) => {
                                const top = `${33.33 * i}%`;
                                return (
                                    <div key={i} className="absolute left-[18.5px] w-[3px] bg-[#F0F0F0]" style={{ top, height: "33.33%" }}>
                                        <div
                                            ref={el => { lineRefs.current[i] = el; }}
                                            className="w-full h-full bg-[#0A4834] origin-top scale-y-0"
                                        />
                                    </div>
                                );
                            })}

                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    ref={el => { nodeRefs.current[i] = el; }}
                                    className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border flex items-center justify-center shadow-md z-20"
                                    style={{
                                        top: `${33.33 * i}%`,
                                        transform: "translateY(-50%)",
                                        borderColor: i === 0 ? "#0A4834" : "#E0E0E0",
                                        backgroundColor: i === 0 ? "#0A4834" : "#E0E0E0"
                                    }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-[#E0E0E0]" />
                                </div>
                            ))}

                            <div
                                ref={indicatorRef}
                                className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0A4834] border-[2px] border-white shadow-lg flex items-center justify-center z-40 pointer-events-none"
                                style={{ top: "0%", transform: "translateY(-50%)" }}
                            >
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>

                        </div>
                    </div>

                    {/* CARDS */}
                    <div className="col-span-12 lg:col-span-6 flex flex-col relative h-[360px] md:h-[400px] lg:h-[420px] overflow-hidden items-center max-w-[440px] mx-auto w-full mt-12 lg:mt-0">
                        <div ref={cardContainerRef} className="w-full flex flex-col items-center">
                            {eventItems.map((item, index) => (
                                <EventCard key={item.id} item={item} index={index} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

function EventCard({ item, index }: { item: any; index: number }) {
    return (
        <div className="w-full h-[360px] md:h-[400px] lg:h-[420px] flex-shrink-0 flex flex-col justify-center bg-[#f5f5f5] py-6 px-5 rounded-sm shadow-xl border border-black/5">
            <div className="w-full max-w-lg mx-auto">
                <h3 className="font-display text-base md:text-lg lg:text-2xl font-black text-black mb-2 uppercase tracking-tighter">
                    {item.title}
                </h3>
                <p className="font-sans text-[12px] md:text-[13px] text-[#555] mb-4 leading-relaxed line-clamp-2">
                    {item.desc}
                </p>
                <div className="w-full aspect-[16/8] relative rounded-sm overflow-hidden">
                    <Image fill src={item.image} alt={item.title} className="object-cover" />
                </div>
            </div>
        </div>
    );
}
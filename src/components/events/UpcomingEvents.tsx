"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function UpcomingEvents() {
    // Cinematic Reveal Variants
    const lateralFadeVariants: any = {
        hidden: { 
            opacity: 0, 
            x: -60 // Start from left
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: { 
                duration: 1.2, 
                ease: [0.76, 0, 0.24, 1] 
            }
        }
    };

    const verticalFadeVariants: any = {
        hidden: { 
            opacity: 0, 
            y: -100 // Start from top
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                duration: 1.4, 
                ease: [0.76, 0, 0.24, 1] 
            }
        }
    };

    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto flex flex-col gap-12 md:gap-16">

                {/* Header - STAGGERED LATERAL FADE */}
                <div className="flex flex-col gap-4 max-w-3xl">
                    <motion.h2 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={lateralFadeVariants}
                        className="font-display text-4xl md:text-5xl lg:text-7xl font-black text-black tracking-tight leading-none uppercase"
                    >
                        Upcoming Events
                    </motion.h2>
                    <motion.p 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={lateralFadeVariants}
                        transition={{ delay: 0.3 }} // STAGGERED AFTER HEADING
                        className="font-sans text-[#555] text-sm md:text-lg leading-relaxed max-w-2xl opacity-80"
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </motion.p>
                </div>

                {/* Cards Grid - ONE-BY-ONE VERTICAL DISCOVERY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Card 1 - FIRST ACTOR (Delayed after Header) */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={verticalFadeVariants}
                        transition={{ delay: 0.8 }} // DELAY AFTER TEXT SEQUENCE
                        className="bg-[#D9D9D9] p-8 md:p-10 lg:p-14 rounded-none aspect-square md:aspect-[4/3] flex flex-col justify-end relative overflow-hidden group shadow-lg"
                    >
                        <Image src="/events/event-4.webp" alt="Event 4" fill priority className="object-cover transition-transform duration-1000 group-hover:scale-110 ease-out" />
                        <div className="absolute inset-0 bg-black/40 z-0 group-hover:bg-black/20 transition-colors duration-700"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-end justify-between w-full gap-6">
                            <div className="flex flex-col gap-3">
                                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[0.9] uppercase tracking-tighter">
                                    Upcoming <br /> Events
                                </h3>
                                <p className="font-sans text-white/90 text-sm md:text-base font-bold tracking-tight opacity-70">
                                    Lorem ipsum dolor
                                </p>
                            </div>

                             {/* Button - Brand Green Pill - Recalibrated to prevent clipping */}
                            <button className="px-6 py-3 bg-[#0A4834] rounded-full hover:brightness-110 transition-all shadow-xl text-white font-sans text-[11px] md:text-xs font-black uppercase tracking-wider shrink-0 active:scale-95">
                                Read More
                            </button>
                        </div>
                    </motion.div>

                    {/* Card 2 - SECOND ACTOR (ONE-BY-ONE GAP) */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={verticalFadeVariants}
                        transition={{ delay: 2.0 }} // PRONOUNCED SEQUENTIAL GAP
                        className="bg-[#D9D9D9] p-8 md:p-10 lg:p-14 rounded-none aspect-square md:aspect-[4/3] flex flex-col justify-end relative overflow-hidden group shadow-lg"
                    >
                        <Image src="/events/event-5.webp" alt="Event 5" fill className="object-cover transition-transform duration-1000 group-hover:scale-110 ease-out" />
                        <div className="absolute inset-0 bg-black/40 z-0 group-hover:bg-black/20 transition-colors duration-700"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-end justify-between w-full gap-6">
                            <div className="flex flex-col gap-3">
                                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[0.9] uppercase tracking-tighter">
                                    Upcoming <br /> Events
                                </h3>
                                <p className="font-sans text-white/90 text-sm md:text-base font-bold tracking-tight opacity-70">
                                    Lorem ipsum dolor
                                </p>
                            </div>

                             {/* Button - Brand Green Pill - Recalibrated to prevent clipping */}
                            <button className="px-6 py-3 bg-[#0A4834] rounded-full hover:brightness-110 transition-all shadow-xl text-white font-sans text-[11px] md:text-xs font-black uppercase tracking-wider shrink-0 active:scale-95">
                                Read More
                            </button>
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
}

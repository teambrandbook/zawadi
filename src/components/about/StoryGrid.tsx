"use client";

import { motion } from "framer-motion";

export default function StoryGrid() {
    const stories = [
        { id: "01", title: "Zewadi story", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { id: "02", title: "Zewadi story", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { id: "03", title: "Zewadi story", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { id: "04", title: "Zewadi story", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    ];

    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* 1. Fading Title - Mixed Case to match luxury branding */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-black text-center mb-16 md:mb-24 tracking-tighter leading-[0.85]"
                >
                    The story behind the <br /> flavors
                </motion.h2>

                {/* Grid Container */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                            whileHover="hover"
                            whileTap="hover"
                            className="group relative bg-[#0A4834] p-8 md:p-12 flex gap-8 md:gap-10 items-start rounded-sm overflow-hidden"
                        >
                            {/* MODERN DIAGONAL SHINING EFFECT LAYER */}
                            <motion.div 
                                variants={{
                                    hover: { 
                                        x: ["-170%", "170%"],
                                        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                                    }
                                }}
                                className="absolute inset-x-0 -top-full h-[300%] w-[350%] z-10 pointer-events-none -skew-x-12"
                                style={{ 
                                    background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.02) 60%, transparent 100%)",
                                    left: "-120%"
                                }}
                            />

                            {/* Background Overlay for slight depth on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                            {/* Number - In Beige */}
                            <span className="relative z-20 font-display text-6xl md:text-8xl font-bold text-[#EAE3D2] tracking-tighter leading-none">
                                {story.id}
                            </span>

                            {/* Text Content - In Beige */}
                            <div className="relative z-20 flex flex-col gap-3 pt-3">
                                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#EAE3D2] tracking-tight">
                                    {story.title}
                                </h3>
                                <p className="font-sans text-[#EAE3D2]/80 text-sm md:text-base leading-relaxed max-w-sm">
                                    {story.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

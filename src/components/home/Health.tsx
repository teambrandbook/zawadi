"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Health() {
    return (
        <section className="w-full bg-[#0A4834] py-24 px-6 md:px-12 lg:px-24 overflow-hidden relative">
            <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-0 md:gap-12 items-center">

                {/* Left Column: Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="lg:col-span-3 flex flex-col gap-8 z-10 relative"
                >
                    <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white mb-2 uppercase tracking-tighter leading-[0.9] drop-shadow-sm">
                        Where Every Meal <br className="hidden md:block" /> Becomes a Memory
                    </h2>
                    <p className="font-sans text-gray-300 text-lg md:text-xl leading-relaxed max-w-lg lg:max-w-xl opacity-90 font-light">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
                    </p>
                </motion.div>

                {/* Right Column: Image Shape - FADES IN FROM RIGHT TO LEFT */}
                <div className="lg:col-span-2 relative h-[400px] md:h-[600px] w-full lg:w-[150%] lg:-mr-[50%] sm:ml-[10%] z-10 flex justify-end mt-12 lg:mt-0">
                    <motion.div
                        initial={{ opacity: 0, x: 200 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a luxury slide
                            delay: 0.2
                        }}
                        className="relative w-full h-full bg-[#222] rounded-l-full overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-y border-l border-white/10"
                    >
                        <Image
                            src="/home/section8.webp"
                            alt="Health and Wellness"
                            fill
                            className="object-cover scale-105 hover:scale-110 transition-transform duration-[3000ms] ease-out"
                        />
                    </motion.div>
                </div>

            </div>
        </section>
    );
}

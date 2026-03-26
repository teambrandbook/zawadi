"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import WipeButton from "../shared/WipeButton";

export default function Developing() {
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "circOut" }
        }
    };

    // SLIDE FROM LEFT VARIANTS
    const slideLeftVariants: any = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 1, ease: "circOut" }
        }
    };

    // SWIPE REVEAL VARIANTS (Top to Bottom)
    const swipeVariants: any = {
        hidden: {
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            scale: 1.05
        },
        visible: {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.76, 0, 0.24, 1], // Luxury ease
                opacity: { duration: 0.4 }
            }
        }
    };

    return (
        <section className="w-full bg-white py-12 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-[85rem] mx-auto flex flex-col items-center"
            >

                {/* Header Section */}
                <div className="text-center max-w-4xl mb-20 flex flex-col items-center gap-6">
                    <motion.h2
                        variants={itemVariants}
                        className="font-display text-5xl md:text-7xl font-bold text-[#000000] tracking-tight leading-tight"
                    >
                        Where Every Meal Becomes a Memory
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-3xl"
                    >
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </motion.p>
                </div>

                {/* Content Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* Left Column: Tall Image + Pill Toggle */}
                    <div className="flex flex-col gap-10">
                        <motion.div
                            variants={swipeVariants}
                            className="w-full aspect-[3/4] relative bg-[#f5f5f5] rounded-sm overflow-hidden shadow-sm group"
                        >
                            <Image
                                src="/home/section5-1.webp"
                                alt="Meal memory vertical"
                                fill
                                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <WipeButton href="/community" label="Explore More" />
                        </motion.div>
                    </div>

                    {/* Right Column: Wide Image + Descriptive Text */}
                    <div className="flex flex-col gap-10">
                        <motion.div
                            variants={swipeVariants}
                            className="w-full aspect-[4/3] relative bg-[#f5f5f5] rounded-sm overflow-hidden shadow-sm group"
                        >
                            <Image
                                src="/home/section5-2.webp"
                                alt="Meal memory horizontal"
                                fill
                                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                        </motion.div>
                        <motion.p
                            variants={slideLeftVariants}
                            className="font-sans text-[#555] text-sm md:text-[15px] leading-relaxed max-w-xl"
                        >
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                        </motion.p>
                    </div>

                </div>

            </motion.div>
        </section>
    );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import WipeButton from "../shared/WipeButton";

export default function About() {
    // Container staggered reveal
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

    // SWIPE Reveal for Headings (Left to Right)
    const swipeRightVariants: any = {
        hidden: {
            clipPath: "inset(0% 100% 0% 0%)",
            opacity: 0,
            x: -20
        },
        visible: {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            x: 0,
            transition: {
                duration: 1.2,
                ease: [0.77, 0, 0.175, 1],
                opacity: { duration: 0.4 }
            }
        }
    };

    // FADE IN FROM LEFT for Content
    const fadeLeftVariants: any = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "circOut" }
        }
    };

    // Image Wipe Reveal (Top to Bottom)
    const imageWipeVariants: any = {
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
                ease: [0.76, 0, 0.24, 1]
            }
        }
    };

    return (
        <section className="w-full bg-white py-12 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-24 md:gap-32">

                {/* Row 1: Text Left, Large Image Right */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 items-center"
                >
                    <div className="flex flex-col gap-6 order-1">
                        <motion.h2
                            variants={fadeLeftVariants}
                            className="font-display text-5xl md:text-7xl font-black text-black leading-tight uppercase tracking-tighter"
                        >
                            Zewadi Community
                        </motion.h2>
                        <motion.p
                            variants={fadeLeftVariants}
                            className="font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-md"
                        >
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                        </motion.p>
                    </div>

                    <motion.div
                        variants={imageWipeVariants}
                        className="relative aspect-[16/11] w-full bg-[#f0f0f0] rounded-sm overflow-hidden shadow-sm order-2 group"
                    >
                        <Image
                            src="/home/section2-3.webp"
                            alt="Zewadi Community Activities"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </motion.div>
                </motion.div>

                {/* Row 2: Two Vertical Images Left, Headline & Button Right */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 items-center"
                >
                    <div className="flex gap-4 md:gap-6 order-2 md:order-1 h-80 md:h-[28rem]">
                        <motion.div
                            variants={imageWipeVariants}
                            className="relative w-1/2 rounded-sm overflow-hidden shadow-sm group"
                        >
                            <Image
                                src="/home/section2-1.webp"
                                alt="Fresh market produce"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </motion.div>
                        <motion.div
                            variants={imageWipeVariants}
                            className="relative w-1/2 rounded-sm overflow-hidden shadow-sm group"
                        >
                            <Image
                                src="/home/section2-2.webp"
                                alt="Zewadi customer or partner"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </motion.div>
                    </div>

                    <div className="flex flex-col gap-10 order-1 md:order-2 items-start">
                        <div className="flex flex-col gap-6">
                            <motion.h3
                                variants={fadeLeftVariants}
                                className="font-display text-4xl md:text-6xl font-black text-black leading-[1.1] tracking-tighter"
                            >
                                Eat Fresh. <br className="md:hidden" /> Live Well.
                            </motion.h3>
                            <motion.p
                                variants={fadeLeftVariants}
                                className="font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-[400px]"
                            >
                                Redefining your food experience with technology and sustainable agriculture. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </motion.p>
                        </div>

                        <motion.div variants={fadeLeftVariants}>
                            <WipeButton href="/community" label="Explore More" />
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

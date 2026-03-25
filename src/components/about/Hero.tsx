"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
    // 1. Container Variants for coordinated reveal
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // This ensures staggered entrance of images
                delayChildren: 0.1
            }
        }
    };

    // 2. Image Swipe Variants (Left-to-Right Reveal)
    const imageVariants: any = {
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

    // 3. Text/Header Variants (Fade Slide)
    const fadeVariants: any = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 1,
                ease: [0.76, 0, 0.24, 1]
            }
        }
    };

    return (
        <section className="w-full bg-white pt-40 pb-12 md:pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <motion.div 
                className="max-w-[85rem] mx-auto flex flex-col items-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }} // Increased visibility margin
            >

                {/* Header Section */}
                <motion.div 
                    variants={fadeVariants}
                    className="text-center max-w-4xl mb-16 md:mb-20"
                >
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-black mb-6 tracking-tight leading-[0.9]">
                        The story behind the <br /> flavors
                    </h1>
                    <p className="font-sans text-[#555] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">

                    {/* Left Column: Large Vertical Image */}
                    <motion.div 
                        variants={imageVariants}
                        className="w-full aspect-[3/4] md:aspect-[4/5] relative rounded-sm overflow-hidden shadow-sm group bg-[#f8f8f8]"
                    >
                        <Image 
                            src="/about/about-1.1.webp" 
                            alt="About Hero Vertical" 
                            fill 
                            className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                        />
                    </motion.div>

                    {/* Right Column: Smaller Image + Text */}
                    <div className="flex flex-col gap-8 md:gap-12">
                        {/* Top Image */}
                        <motion.div 
                            variants={imageVariants}
                            className="w-full aspect-[5/4] relative rounded-sm overflow-hidden shadow-sm group bg-[#f8f8f8]"
                        >
                            <Image 
                                src="/about/about-2.2.webp" 
                                alt="About Hero Square" 
                                fill 
                                className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
                            />
                        </motion.div>

                        {/* Text Block */}
                        <motion.p 
                            variants={fadeVariants}
                            className="font-sans text-[#555] text-base md:text-lg leading-relaxed"
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </motion.p>
                    </div>

                </div>

            </motion.div>
        </section>
    );
}

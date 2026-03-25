"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function StoryCheckerboard() {
    // Cinematic Fade/Scale Variants for reliability
    const imageFadeVariants: any = {
        hidden: { 
            opacity: 0,
            scale: 1.05
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { 
                duration: 1.4, 
                ease: [0.76, 0, 0.24, 1] 
            }
        }
    };

    const textFadeVariants: any = {
        hidden: { 
            opacity: 0, 
            y: 30 // Soft rise
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                duration: 1.2, 
                delay: 0.2, 
                ease: [0.22, 1, 0.36, 1] 
            }
        }
    };

    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2">

                {/* Block 1: Image (Top Left) - RELIABLE FADE */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={imageFadeVariants}
                    className="aspect-square relative w-full h-full min-h-[400px] overflow-hidden bg-[#f0f0f0]"
                >
                    <Image 
                        src="/events/event-2.webp" 
                        alt="Event Story 1" 
                        fill 
                        priority 
                        className="object-cover" 
                    />
                </motion.div>

                {/* Block 2: Text (Top Right) - FADE IN */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={textFadeVariants}
                    className="aspect-square bg-[#0A4834] w-full h-full min-h-[350px] md:min-h-[400px] p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col justify-center"
                >
                    <h3 className="font-display text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-[#EAE3D2] mb-6 lg:mb-8 uppercase tracking-tighter leading-[0.85]">
                        Zewadi <br /> story
                    </h3>
                    <p className="font-sans text-[#EAE3D2]/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg font-medium">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </motion.div>

                {/* Block 3: Text (Bottom Left) - FADE IN */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={textFadeVariants}
                    className="aspect-square bg-[#0A4834] w-full h-full min-h-[350px] md:min-h-[400px] p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col justify-center order-last md:order-none"
                >
                    <h3 className="font-display text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-[#EAE3D2] mb-6 lg:mb-8 uppercase tracking-tighter leading-[0.85]">
                        Zewadi <br /> story
                    </h3>
                    <p className="font-sans text-[#EAE3D2]/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg font-medium">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </motion.div>

                {/* Block 4: Image (Bottom Right) - RELIABLE FADE */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={imageFadeVariants}
                    className="aspect-square relative w-full h-full min-h-[400px] overflow-hidden bg-[#f0f0f0]"
                >
                    <Image 
                        src="/events/event-3.webp" 
                        alt="Event Story 2" 
                        fill 
                        className="object-cover" 
                    />
                </motion.div>

            </div>
        </section>
    );
}

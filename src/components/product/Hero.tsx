"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
    // Cinematic Wipe Reveal Logic for Images/Buttons
    const wipeRevealVariants: any = {
        hidden: { 
            clipPath: "inset(0 100% 0 0)",
            opacity: 0
        },
        visible: { 
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            transition: { 
                duration: 1.2, 
                ease: [0.76, 0, 0.24, 1] 
            }
        }
    };

    // Staggered Fade In for Contents
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.4 
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { 
                duration: 1, 
                ease: [0.22, 1, 0.36, 1] 
            }
        }
    };

    // THE SWIRL REVEAL FOR THUMBNAILS
    const swirlVariants: any = {
        hidden: { 
            opacity: 0, 
            scale: 0.4, 
            rotate: -180 
        },
        visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { 
                duration: 1.2, 
                delay: 1.2 + (i * 0.2), // Starts after main wipe and title
                ease: [0.34, 1.56, 0.64, 1] // Springy/Luxury finish
            }
        })
    };

    return (
        <section className="w-full bg-white pt-40 pb-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                {/* Left Column: Image with Wipe Reveal */}
                <div className="flex flex-col gap-14">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={wipeRevealVariants}
                        className="w-full aspect-square relative rounded-none overflow-hidden shadow-sm bg-[#f5f5f5]"
                    >
                        <Image src="/product/product-1.webp" alt="Buckwheat" fill className="object-cover" />
                        
                        {/* Sandal Shimmer Edge for entrance wipe */}
                        <motion.div 
                            initial={{ left: "0%" }}
                            whileInView={{ left: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                            className="absolute inset-y-0 w-[4px] bg-[#EAE3D2] z-30 shadow-[0_0_30px_rgba(234,227,210,0.8)] pointer-events-none"
                        />
                    </motion.div>

                    {/* Thumbnails - SWIRL AND APPEAR */}
                    <div className="flex justify-between items-center px-4">
                        {[
                            { src: "/product/product-2.webp", alt: "Thumb 1" },
                            { src: "/product/product-3.webp", alt: "Thumb 2" },
                            { src: "/product/product-4.webp", alt: "Thumb 3" }
                        ].map((thumb, i) => (
                            <motion.div 
                                key={thumb.alt}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={swirlVariants}
                                className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 relative rounded-full overflow-hidden border-2 border-transparent shadow-xl hover:scale-110 transition-transform cursor-pointer group bg-gray-100"
                            >
                                <Image src={thumb.src} alt={thumb.alt} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Staggered Content Details */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="flex flex-col"
                >
                    {/* Title & Price */}
                    <div className="mb-8">
                        <motion.h1 
                            variants={itemVariants}
                            className="font-display text-5xl md:text-6xl font-black text-black uppercase tracking-tight leading-none mb-4"
                        >
                            BUCKWHEAT
                        </motion.h1>
                        <motion.p 
                            variants={itemVariants}
                            className="font-sans text-xl font-extrabold text-black"
                        >
                            $ 120.00 USD
                        </motion.p>
                    </div>

                    {/* Description */}
                    <motion.p 
                        variants={itemVariants}
                        className="font-sans text-[#444] text-[15px] leading-relaxed mb-10 max-w-2xl"
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
                    </motion.p>

                    {/* Benefits List Staggered */}
                    <motion.div variants={itemVariants} className="mb-12">
                        <ul className="list-disc list-outside ml-5 space-y-1 font-sans text-black text-[15px] leading-relaxed font-medium">
                            <li>Only the finest local and seasonal ingredients.</li>
                            <li>Healthy, chemical-free components for every dish.</li>
                            <li>Supporting local farmers and sustainable produce.</li>
                            <li>Each ingredient carefully selected for peak flavor.</li>
                            <li>Ingredients that celebrate each season&apos;s best.</li>
                            <li>Top-quality meats, seafood, and plant-based options.</li>
                            <li>Freshly baked, handmade, or house-prepared items.</li>
                        </ul>
                    </motion.div>

                    {/* Action Buttons: Swipe Reveal */}
                    <div className="flex gap-4 mb-20 items-center">
                        {/* Heart Icon Button Swipe */}
                        <motion.div
                            variants={wipeRevealVariants}
                            transition={{ duration: 1, delay: 0.8 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-16 h-12 bg-[#0A4834] rounded-none flex items-center justify-center text-white hover:brightness-110 transition-all shadow-md relative overflow-hidden"
                                aria-label="Add to favorites"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </motion.button>
                        </motion.div>

                        {/* Buy Now Button Swipe */}
                        <motion.div
                            variants={wipeRevealVariants}
                            transition={{ duration: 1, delay: 0.9 }}
                            className="h-12 w-48 shadow-md"
                        >
                            <Link href="/contact" className="w-full h-full bg-[#0A4834] rounded-none flex items-center justify-center text-white font-sans font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all">
                                Buy now
                            </Link>
                        </motion.div>
                    </div>

                    {/* Zewadi Story Row 2 Staggered */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 pt-12 items-start border-t border-gray-100">

                        {/* Story Col 1 (with wide swipe button) */}
                        <motion.div variants={itemVariants} className="flex flex-col items-start gap-4">
                            <h4 className="font-sans text-xl font-extrabold text-black uppercase tracking-tight">Zewadi story</h4>
                            <p className="font-sans text-[#555] text-[13px] leading-relaxed max-w-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <motion.div 
                                variants={wipeRevealVariants}
                                className="h-11 w-full max-w-[280px] mt-4"
                            >
                                <Link href="/recipes" className="w-full h-full bg-[#0A4834] rounded-none flex items-center justify-center text-white font-sans font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-md">
                                    Recipes
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Story Col 2 */}
                        <motion.div variants={itemVariants} className="flex flex-col items-start gap-4">
                            <h4 className="font-sans text-xl font-extrabold text-black uppercase tracking-tight">Zewadi story</h4>
                            <p className="font-sans text-[#555] text-[13px] leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </motion.div>

                    </div>

                </motion.div>

            </div>
        </section>
    );
}

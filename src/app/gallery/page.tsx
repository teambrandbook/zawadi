"use client";

import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GalleryPage() {
    const images = [
        { src: "/events/event-1.webp", alt: "Gallery 1", cols: "md:col-span-4", aspect: "aspect-[4/5]" },
        { src: "/events/event-5.webp", alt: "Gallery 2", cols: "md:col-span-8", aspect: "aspect-[16/9]" },
        { src: "/community/community-1.webp", alt: "Gallery 3", cols: "md:col-span-8", aspect: "aspect-[16/9]" },
        { src: "/events/event-2.webp", alt: "Gallery 4", cols: "md:col-span-4", aspect: "aspect-square" },
        { src: "/events/event-3.webp", alt: "Gallery 5", cols: "md:col-span-12", aspect: "aspect-[21/9]" },
        { src: "/community/community-3.webp", alt: "Gallery 6", cols: "md:col-span-5", aspect: "aspect-[4/5]" },
        { src: "/community/community-6.webp", alt: "Gallery 7", cols: "md:col-span-7", aspect: "aspect-square" },
        { src: "/community/community-8.webp", alt: "Gallery 8", cols: "md:col-span-6", aspect: "aspect-[4/5]" },
        { src: "/events/event-4.webp", alt: "Gallery 9", cols: "md:col-span-6", aspect: "aspect-[4/5]" },
    ];

    // Cinematic Wipe Reveal Logic
    const entranceWipeVariants: any = {
        hidden: { 
            clipPath: "inset(0 100% 0 0)",
            opacity: 0
        },
        visible: { 
            clipPath: "inset(0 0 0 0)",
            opacity: 1,
            transition: { 
                duration: 0.9, 
                ease: [0.76, 0, 0.24, 1] 
            }
        }
    };

    const wiperVariants: any = {
        hidden: { left: "-100%" },
        visible: { 
            left: "100%",
            transition: { 
                duration: 1.2, 
                ease: [0.76, 0, 0.24, 1] 
            }
        }
    };

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            
            <section className="pt-44 pb-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-[85rem] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 md:mb-24">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                            className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tighter leading-[0.85] uppercase"
                        >
                            Gallery
                        </motion.h1>
                    </div>

                    {/* Perfectly preserved original asymmetrical grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {images.map((img, index) => (
                            <motion.div 
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                className={`${img.cols} ${img.aspect} relative rounded-none overflow-hidden group cursor-pointer bg-[#F5F5F5] shadow-xl`}
                            >
                                {/* THE REVEALED IMAGE */}
                                <motion.div 
                                    variants={entranceWipeVariants}
                                    className="absolute inset-0 z-10 w-full h-full"
                                >
                                    <Image 
                                        src={img.src} 
                                        alt={img.alt} 
                                        fill 
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                                    />
                                </motion.div>

                                {/* THE WIPER BLOCK - THE "ACTIVE" SWEEP AS SEEN IN WIPEBUTTON */}
                                <motion.div 
                                    variants={wiperVariants}
                                    className="absolute inset-y-0 w-full bg-[#EAE3D2] z-30 pointer-events-none"
                                />

                                {/* Subtle Overlay Border */}
                                <div className="absolute inset-0 border border-black/0 group-hover:border-black/5 transition-colors duration-500 z-40" />
                            </motion.div>
                        ))}
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}

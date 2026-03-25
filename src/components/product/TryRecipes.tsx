"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function TryRecipes() {
    const recipes = [
        { id: 1, image: "/product/product-2.webp" },
        { id: 2, image: "/product/product-4.webp" },
        { id: 3, image: "/product/product-5.webp" },
    ];

    // STAGGERED ZOOM VARIANT
    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // "One by one" delay
                delayChildren: 0.1
            }
        }
    };

    const zoomItemVariants: any = {
        hidden: { 
            opacity: 0, 
            scale: 0.85, 
            y: 20 
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { 
                duration: 1, 
                ease: [0.34, 1.56, 0.64, 1] // Luxury Spring for playful arrival
            }
        }
    };

    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-black text-center mb-16 uppercase tracking-tighter">
                        Try Recipes
                    </h2>
                </motion.div>
                
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
                >
                    {recipes.map((recipe) => (
                        <motion.div 
                            key={recipe.id} 
                            variants={zoomItemVariants}
                            className="bg-[#0A4834] p-4 flex flex-col gap-6 shadow-2xl relative group cursor-pointer"
                        >
                            {/* RECIPE IMAGE CONTAINER */}
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/5">
                                <Image 
                                    src={recipe.image} 
                                    alt="Recipe" 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                                />
                                
                                {/* Overlay glow on hover */}
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />
                            </div>

                            <p className="font-display text-white text-lg lg:text-xl font-bold leading-tight px-2 pb-2">
                                Discover the rich flavors<br />that inspire our kitchen
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

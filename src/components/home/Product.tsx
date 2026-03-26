"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const products = [
    {
        id: 1,
        image: "/home/section6-1.webp",
        title: "Dried Fruits & Nuts",
        desc: "Bridging the gap between technology and agriculture to redefine your food experience. Our organic selection is grown with care."
    },
    {
        id: 2,
        image: "/home/section6-center.webp",
        title: "Raw Zewadi Honey",
        desc: "Experience the ultimate in sustainable agriculture. Our premium products bring the freshness of the farm directly to your table."
    },
    {
        id: 3,
        image: "/home/section6-right.webp",
        title: "Organic Green Tea",
        desc: "Redefining purity and taste. Explore our specialized range of agricultural wonders, crafted for the health-conscious consumer."
    }
];

export default function Product() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Buttery smooth physics
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 40,
        mass: 0.8
    });

    return (
        <section ref={containerRef} className="relative h-[650vh] bg-white pt-16 md:pt-24">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-visible">
                <div className="w-[95%] lg:w-[90%] max-w-[90rem] bg-[#9F8151] mx-auto relative pt-20 md:pt-24 pb-12 md:pb-24 px-6 md:px-16 lg:px-24 rounded-sm shadow-inner overflow-visible transition-all duration-700">

                    {/* Header - Top Left (Optimized for smaller cards) */}
                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-[#EAE3D2] mb-12 md:mb-10 pt-4 md:pt-6 tracking-tighter text-left z-40 relative pointer-events-none uppercase">
                        Our Product
                    </h2>

                    {/* Carousel Container - Recalibrated for solid precision */}
                    <div className="relative w-full h-[14rem] md:h-[18rem] lg:h-[22rem] flex items-center justify-center z-20">
                        <div className="relative w-full h-full flex items-center justify-center">
                            {products.map((product, index) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    index={index} 
                                    progress={smoothProgress} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Description Text - DYNAMICALLY CHANGING */}
                    <div className="relative z-30 mt-8 md:mt-10 max-w-2xl mx-auto text-center px-4 h-24 flex items-center justify-center">
                        {products.map((product, index) => {
                            const pStart = index / 3;
                            const pEnd = (index + 1) / 3;
                            
                            return (
                                <motion.p 
                                    key={`desc-${product.id}`}
                                    className="font-sans text-[#EAE3D2] text-sm md:text-lg leading-relaxed font-light absolute top-0 left-0 right-0 tracking-wide"
                                    style={{ 
                                        opacity: useTransform(
                                            smoothProgress,
                                            [ pStart - 0.15, pStart, pEnd - 0.15, pEnd ],
                                            [0, 1, 1, 0]
                                        ),
                                        y: useTransform(
                                            smoothProgress,
                                            [ pStart - 0.15, pStart, pEnd - 0.15, pEnd ],
                                            [20, 0, 0, -20]
                                        ),
                                        visibility: useTransform(
                                            smoothProgress,
                                            [ pStart - 0.15, pStart, pEnd ],
                                            ["hidden", "visible", "hidden"]
                                        ) as any
                                    }}
                                >
                                    {product.desc}
                                </motion.p>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}

function ProductCard({ product, index, progress }: { product: any, index: number, progress: any }) {
    const p = progress;
    const turn = index / 3;
    const nextTurn = (index + 1) / 3;
    
    // Smooth transition window
    const transitionWindow = 0.12; 

    // Translation - Card slides out beautifully
    const xPos = useTransform(
        p,
        [ turn, nextTurn - transitionWindow, nextTurn - (transitionWindow/2), nextTurn, 1 ],
        [ "0px", "0px", "-400px", "0px", "0px" ] // Slightly tighter slide for smaller cards
    );

    // Scaling
    const scale = useTransform(
        p,
        [ 0, turn - transitionWindow, turn, nextTurn - transitionWindow, nextTurn, 1 ],
        [ 0.88, 0.88, 1, 1, 0.88, 0.88 ]
    );

    // Opacity
    const opacity = useTransform(
        p,
        [ turn - (transitionWindow * 2), turn, nextTurn - transitionWindow, nextTurn - (transitionWindow/2), nextTurn, 1 ],
        [ 0.5, 1, 1, 0, 0.5, 0.5 ]
    );

    // ZIndex
    const zIndex = useTransform(
        p,
        [ turn - 0.02, turn, nextTurn - 0.02, nextTurn ],
        [ 10, 50, 50, 10 ]
    );

    // Rotation
    const rotate = useTransform(
        p,
        [ nextTurn - transitionWindow, nextTurn - (transitionWindow/2), nextTurn ],
        [ 0, -8, 0 ]
    );

    return (
        <motion.div
            style={{ 
                x: xPos,
                rotate,
                scale,
                opacity,
                zIndex,
                position: "absolute"
            }}
            // REDUCED DIMENSIONS:
            // Mobile: w-52, h-[14rem]
            // Tablet: w-[18rem], h-[18rem]
            // Large: w-[20rem], h-[22rem]
            className="w-52 h-[14rem] md:w-[18rem] lg:w-[20rem] md:h-[18rem] lg:h-[22rem] shadow-[0_45px_90px_-25px_rgba(0,0,0,0.6)] rounded-sm overflow-hidden bg-black ring-1 ring-white/10"
        >
            <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority={index === 0}
            />
        </motion.div>
    );
}

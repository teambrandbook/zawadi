"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface WipeButtonProps {
    href: string;
    label: string;
    className?: string;
    variant?: "primary" | "beige";
    showIcon?: boolean;
}

export default function WipeButton({ href, label, className = "", variant = "primary", showIcon = true }: WipeButtonProps) {
    // Exact colors from the original design
    const isBeige = variant === "beige";
    const bgClass = isBeige ? "bg-[#EAE3D2]" : "bg-[#0A4834]";
    const textClass = isBeige ? "text-[#0A4834]" : "text-white";
    const circleBgClass = isBeige ? "bg-[#0A4834]" : "bg-white";
    const iconColor = isBeige ? "#EAE3D2" : "#0A4834";

    return (
        <Link href={href} className={`${className} block w-fit`}>
            <motion.div 
                className={`group relative flex items-center justify-center ${bgClass} rounded-full shadow-xl w-fit overflow-hidden cursor-pointer h-14 md:h-16 ${showIcon ? "pl-8 pr-1.5" : "px-16 text-center"}`}
                initial="initial"
                whileHover="hover"
            >
                {/* Button Text Container */}
                <div className={`relative ${showIcon ? "mr-10" : ""} z-10`}>
                    {/* Layer 1: Static Text (Hidden during wipe) */}
                    <motion.span 
                        className={`font-sans font-bold text-[15px] uppercase tracking-widest ${textClass} block`}
                        variants={{
                            initial: { opacity: 1 },
                            hover: { opacity: 0, transition: { duration: 0.1 } }
                        }}
                    >
                        {label}
                    </motion.span>

                    {/* Layer 2: reveal Text (Revealed by wiping circle) */}
                    <motion.span 
                        className={`absolute inset-0 font-sans font-bold text-[15px] uppercase tracking-widest ${textClass} block z-10`}
                        variants={{
                            initial: { 
                                clipPath: "inset(0 100% 0 0)" 
                            },
                            hover: { 
                                clipPath: "inset(0 0% 0 0)",
                                transition: {
                                    duration: 0.6,
                                    ease: [0.76, 0, 0.24, 1],
                                    delay: 0.05
                                }
                            }
                        }}
                    >
                        {label}
                    </motion.span>
                </div>

                {/* The White Circle - Swipes from Left to Right on Hover (Optional) */}
                {showIcon && (
                    <motion.div 
                        className={`w-10 h-10 md:w-12 md:h-12 ${circleBgClass} rounded-full flex items-center justify-center relative z-20 shadow-md ml-auto`}
                        variants={{
                            initial: { 
                                x: 0 
                            },
                            hover: { 
                                // Swipe from Left edge to Right edge
                                x: [-180, 0], 
                                transition: {
                                    duration: 0.6,
                                    ease: [0.76, 0, 0.24, 1]
                                }
                            }
                        }}
                    >
                        <svg
                            className="h-5 w-5 md:h-6 md:w-6"
                            viewBox="0 0 24 24"
                            fill={iconColor}
                        >
                            <rect x="3" y="11" width="5" height="2.5" rx="1.25" />
                            <path d="M10 8c0-1.1 1.2-1.8 2.1-1.3l6.3 3.6c.9.5.9 1.9 0 2.4l-6.3 3.6c-.9.5-2.1-.2-2.1-1.3V8z" />
                        </svg>
                    </motion.div>
                )}
                
                {/* Subtle Hover Overlay */}
                <motion.div 
                    className={`absolute inset-0 z-0 pointer-events-none ${isBeige ? "bg-white/5" : "bg-black/10"}`}
                    variants={{
                        initial: { opacity: 0 },
                        hover: { opacity: 1 }
                    }}
                />
            </motion.div>
        </Link>
    );
}

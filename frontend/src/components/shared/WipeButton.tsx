"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface WipeButtonProps {
    href: string;
    label: string;
    className?: string;
    variant?: "primary" | "beige";
    showIcon?: boolean;
}

export default function WipeButton({ href, label, className = "", variant = "primary", showIcon = true }: WipeButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Exact colors from the original design
    const isBeige = variant === "beige";
    const bgClass = isBeige ? "bg-[#EAE3D2]" : "bg-[#0A4834]";
    const textClass = isBeige ? "text-[#0A4834]" : "text-white";
    const circleBgClass = isBeige ? "bg-[#0A4834]" : "bg-white";
    const iconColor = isBeige ? "#EAE3D2" : "#0A4834";

    const handleMouseEnter = () => {
        const scope = gsap.utils.selector(containerRef);
        
        // Kill existing animations on these elements
        gsap.killTweensOf([scope(".icon-circle"), scope(".label-reveal"), scope(".label-fade-1")]);

        // Wipe In
        gsap.fromTo(scope(".icon-circle"), 
            { x: -180, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.6, ease: "power3.inOut" }
        );

        gsap.fromTo(scope(".label-reveal"), 
            { clipPath: "inset(0 100% 0 0)" }, 
            { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power3.inOut" }
        );

        gsap.to(scope(".label-fade-1"), { opacity: 0, duration: 0.2 });
    };

    const handleMouseLeave = () => {
        const scope = gsap.utils.selector(containerRef);
        
        // Return to natural 'on right' state
        gsap.to(scope(".icon-circle"), { x: 0, opacity: 1, duration: 0.4, ease: "power2.inOut" });
        gsap.to(scope(".label-reveal"), { clipPath: "inset(0 100% 0 0)", duration: 0.4 });
        gsap.to(scope(".label-fade-1"), { opacity: 1, duration: 0.3 });
    };

    return (
        <Link href={href} className={`${className} block w-fit`}>
            <div 
                ref={containerRef}
                className={`group relative flex items-center ${showIcon ? "justify-between pl-10 pr-1.5 min-w-[14rem]" : "justify-center px-16 text-center"} ${bgClass} rounded-full shadow-xl w-fit overflow-hidden cursor-pointer h-14 md:h-16`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Button Text Hub */}
                <div className={`relative z-10 flex-1 h-full flex items-center ${!showIcon ? "justify-center" : ""}`}>
                    <div className="relative w-full">
                        {/* Layer 1: Initially Visible Text */}
                        <span className={`label-fade-1 font-mulish font-bold text-[15px] uppercase tracking-widest ${textClass} block opacity-100 ${!showIcon ? "text-center" : ""}`}>
                            {label}
                        </span>

                        {/* Layer 2: Revealed Text (High intensity discovery) */}
                        <span className={`label-reveal absolute inset-0 font-mulish font-bold text-[15px] uppercase tracking-widest ${textClass} block z-10 ${!showIcon ? "text-center" : ""}`} style={{ clipPath: "inset(0 100% 0 0)" }}>
                            {label}
                        </span>
                    </div>
                </div>

                {/* The White Circle - Physically on the right */}
                {showIcon && (
                    <div className="flex items-center justify-end shrink-0 ml-4 pointer-events-none">
                        <div className={`icon-circle w-11 h-11 md:w-13 md:h-13 ${circleBgClass} rounded-full flex items-center justify-center relative z-20 shadow-md`}>
                            <svg className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill={iconColor}>
                                <rect x="3" y="11" width="5" height="2.5" rx="1.25" />
                                <path d="M10 8c0-1.1 1.2-1.8 2.1-1.3l6.3 3.6c.9.5.9 1.9 0 2.4l-6.3 3.6c-.9.5-2.1-.2-2.1-1.3V8z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}

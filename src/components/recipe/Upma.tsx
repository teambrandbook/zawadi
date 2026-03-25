import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { recipyButtonAnimation } from "../../../lib/animations";

export default function Upma() {
   useEffect(()=>{
       recipyButtonAnimation(".recipe-btn-wrap")
     },[])
     
    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-6 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* Left: Text */}
                    <div className="flex flex-col">

                        {/* Title */}
                        <h2 className="font-display text-5xl md:text-6xl font-black text-black uppercase tracking-tight leading-none mb-6">
                            BUCKWHEAT <br /> UPMA
                        </h2>

                        {/* Description */}
                        <p className="font-sans text-[#555] text-base leading-relaxed mb-8">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>

                        {/* Benefits */}
                        <div className="mb-10">
                            <h3 className="font-display text-lg font-bold text-black mb-4">
                                Benefits
                            </h3>
                            <ul className="list-disc list-outside ml-5 space-y-2 font-sans text-[#555] text-sm md:text-base leading-relaxed">
                                <li>Fresh seasonal ingredients</li>
                                <li>Healthy & chemical-free</li>
                                <li>Supports local farmers</li>
                                <li>Peak flavor selection</li>
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="recipe-btn-wrap mt-4 flex items-center">
                            <Link
                                href="/recipe/upma-special"
                                className="detail-btn flex h-14 w-0 overflow-hidden rounded-full bg-[#0A4834] text-white shadow-sm transition-colors hover:bg-[#1A5A44] md:h-16"
                            >
                                <span className="flex items-center whitespace-nowrap px-6 font-sans text-sm font-bold uppercase tracking-widest">
                                    View Detail
                                </span>
                            </Link>

                            <Link
                                href="/recipe/upma-special"
                                className="arrow-btn flex h-14 w-14 items-center justify-center rounded-full bg-[#0A4834] text-white shadow-md transition-colors hover:bg-[#1A5A44] md:h-16 md:w-16"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                    </div>

                    {/* Right: Image */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-md shadow-sm lg:order-last">
                        <Image
                            src="/recipe/recipe-4.webp"
                            alt="Buckwheat Upma"
                            fill
                            className="object-cover"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
}
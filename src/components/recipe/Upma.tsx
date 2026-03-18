import Image from "next/image";
import Link from "next/link";

export default function Upma() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left: Text Content */}
                <div className="flex flex-col">

                    {/* Title */}
                    <h2 className="font-display text-5xl md:text-6xl font-black text-black uppercase tracking-tight leading-none mb-6">
                        BUCKWHEAT <br /> UPMA
                    </h2>

                    {/* Description */}
                    <p className="font-sans text-[#555] text-base leading-relaxed mb-8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
                    </p>

                    {/* Benefits */}
                    <div className="mb-10">
                        <h3 className="font-display text-lg font-bold text-black mb-4">Benefits</h3>
                        <ul className="list-disc list-outside ml-5 space-y-2 font-sans text-[#555] text-sm md:text-base leading-relaxed">
                            <li>Only the finest local and seasonal ingredients.</li>
                            <li>Healthy, chemical-free components for every dish.</li>
                            <li>Supporting local farmers and sustainable produce.</li>
                            <li>Each ingredient carefully selected for peak flavor.</li>
                            <li>Ingredients that celebrate each season&apos;s best flavors.</li>
                            <li>Top-quality meats, seafood, and plant-based options.</li>
                            <li>Freshly baked, handmade, or house-prepared items.</li>
                        </ul>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="flex items-center gap-6 mt-4">
                        {/* Wide Light Button */}
                        <Link href="/recipe/upma-special" className="h-14 md:h-16 w-48 md:w-56 bg-[#0A4834] rounded-full hover:bg-[#1A5A44] transition-colors shadow-sm flex items-center justify-center text-white font-sans font-bold text-sm uppercase tracking-widest">
                            View Detail
                        </Link>

                        {/* Dark Circle Button */}
                        <Link href="/recipe/upma-special" className="h-14 w-14 md:h-16 md:w-16 bg-[#0A4834] rounded-full flex items-center justify-center hover:bg-[#1A5A44] transition-colors shadow-md text-white">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                </div>

                {/* Right: Image Placeholder */}
                <div className="w-full aspect-square relative rounded-sm shadow-sm order-first lg:order-last overflow-hidden">
                    <Image src="/recipe/recipe-4.webp" alt="Buckwheat Upma" fill className="object-cover" />
                </div>

            </div>
        </section>
    );
}

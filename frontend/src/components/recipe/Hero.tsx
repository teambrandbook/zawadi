"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { buttonAnimation, imageAnimation, recipyButtonAnimation } from "../../../lib/animations";

export default function Hero() {
    useEffect(() => {
        recipyButtonAnimation(".recipe-btn-wrap")
        imageAnimation(".img")
    }, [])

    return (
        <section className="relative w-full bg-white py-8 md:py-10">
            <div className="mx-auto max-w-7xl px-6 md:px-10">
                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">

                    {/* Left: Image */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-md ">
                        <Image
                            src="/product/product-5.webp"
                            alt="Buckwheat Soup"
                            fill
                            className="img object-cover"
                        />
                    </div>

                    {/* Right: Text */}
                    <div className="flex flex-col">

                        {/* Title */}
                        <h1 className="font-boldonse text-xl md:text-[2rem] font-light text-black tracking-tight leading-[1.3] mb-3">
                            SAVOURY BUCKWHEAT<br />PORRIDGE
                        </h1>

                        {/* Description */}
                        <p className="font-mulish text-[#555] text-base leading-relaxed mb-3">
                            Savoury buckwheat porridge is a warm, nourishing dish made with soft-cooked buckwheat, sautéed onions, garlic, and a touch of olive oil. Lightly seasoned and easily customizable with vegetables or protein, it’s a comforting and versatile option for a healthy breakfast or light meal.
                        </p>

                        {/* Benefits */}
                        <div className="mb-2">
                            <h3 className="font-mulish text-sm font-bold text-black mb-2 uppercase">
                                Benefits
                            </h3>
                            <ul className="list-disc list-outside ml-5 space-y-1 font-mulish text-[#555] text-sm md:text-base leading-[1.3]">
                                <li>Rich in nutrients and naturally gluten-free</li>
                                <li>Supports digestion and gut health</li>
                                <li>Helps maintain steady energy levels</li>
                                <li>High in plant-based protein and fiber</li>
                                <li>Heart-friendly and supports cholesterol control</li>
                                <li>Made with simple, clean, and wholesome ingredients</li>
                                <li>Easily customizable with vegetables and proteins</li>
                            </ul>
                        </div>

                        {/* Buttons */}
                        <div className="recipe-btn-wrap mt-4 flex items-center gap-6">
                            <Link
                                href="/recipe/buckwheat-soup"
                                className="detail-btn flex h-14 w-48 overflow-hidden rounded-full bg-[#0A4834] text-white shadow-sm transition-colors hover:bg-[#1A5A44] md:h-16"
                            >
                                <span className="whitespace-nowrap px-6 font-mulish text-sm font-bold uppercase tracking-widest flex items-center">
                                    View More
                                </span>
                            </Link>

                            <Link
                                href="/recipe/buckwheat-soup"
                                className="arrow-btn flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#0A4834] text-white shadow-md transition-colors hover:bg-[#1A5A44]"
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

                </div>
            </div>
        </section>
    );
}
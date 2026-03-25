"use client"

import Image from "next/image";
import { useEffect } from "react";
import gsap from "gsap";
import { fadeUp, zoomInItems } from "../../../lib/animations";


export default function GridGallery() {

    useEffect(()=>{
        fadeUp(".fade-text")
        zoomInItems(".item")
    },[])

    
    return (
        <section className="w-full bg-white py-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col gap-16">

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Item 1: Image (Top Left) */}
                    <div className="item aspect-square relative rounded-sm overflow-hidden shadow-sm md:order-1 lg:order-none">
                        <Image src="/community/community-3.webp" alt="Gallery 1" fill className="object-cover" />
                    </div>

                    {/* Item 2: Text (Top Center) */}
                    <div className="item aspect-square flex flex-col items-center justify-center bg-[#9F8151] p-8 text-center rounded-sm shadow-sm md:order-2 lg:order-none">
                        <h3 className="font-display text-2xl font-bold text-white mb-4">
                            Zewadi
                        </h3>
                        <p className="font-sans text-white/90 text-sm leading-relaxed max-w-xs">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Item 3: Image */}
                    <div className="item aspect-square relative rounded-sm overflow-hidden shadow-sm md:order-4 lg:order-none">
                        <Image src="/community/community-4.webp" alt="Gallery 2" fill className="object-cover" />
                    </div>

                    {/* Item 4: Text */}
                    <div className="item aspect-square flex flex-col items-center justify-center bg-[#9F8151] p-8 text-center rounded-sm shadow-sm md:order-3 lg:order-none">
                        <h3 className="font-display text-2xl font-bold text-white mb-4">
                            Zewadi
                        </h3>
                        <p className="font-sans text-white/90 text-sm leading-relaxed max-w-xs">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Item 5: Image */}
                    <div className="item aspect-square relative rounded-sm overflow-hidden shadow-sm md:order-5 lg:order-none">
                        <Image src="/community/community-5.webp" alt="Gallery 3" fill className="object-cover" />
                    </div>

                    {/* Item 6: Text */}
                    <div className="item aspect-square flex flex-col items-center justify-center bg-[#9F8151] p-8 text-center rounded-sm shadow-sm md:order-6 lg:order-none">
                        <h3 className="font-display text-2xl font-bold text-white mb-4">
                            Zewadi
                        </h3>
                        <p className="font-sans text-white/90 text-sm leading-relaxed max-w-xs">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                </div>

                {/* Bottom Description Text */}
                <div className="w-full">
                    <p className="fade-text font-sans text-[#555] text-base leading-relaxed max-w-4xl">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

            </div>
        </section>
    );
}

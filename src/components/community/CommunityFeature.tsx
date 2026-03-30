"use client"


import Image from "next/image";
import { useEffect } from "react";
import { imageAnimation } from "../../../lib/animations";

export default function CommunityFeature() {
    useEffect(()=>{
        imageAnimation(".img")
    },[])
    return (
        <section className="w-full bg-white py-10 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-12">

                {/* Column 1: Large Vertical Image (Left) */}
                <div className="img lg:col-span-4 flex items-start">
                    <div className="w-full aspect-[3/4] md:aspect-[2/3] relative rounded-sm overflow-hidden shadow-sm">
                        <Image src="/community/community-6.webp" alt="Community 1" fill className="object-cover" />
                    </div>
                </div>

                {/* Column 2: Title and Middle Image */}
                <div className=" lg:col-span-4 flex flex-col gap-12">
                    <div className="img flex flex-col">
                        <h2 className="font-display text-4xl md:text-5xl lg:text-5xl font-black text-black uppercase leading-[0.9] tracking-tighter">
                            Zewadi <br /> Community
                        </h2>
                    </div>
                    
                    <div className="img w-full aspect-[3/4] md:aspect-[2/3] relative rounded-sm overflow-hidden shadow-sm">
                        <Image src="/community/community-7.webp" alt="Community 2" fill className="object-cover" />
                    </div>
                </div>

                {/* Column 3: Text Features (Right) */}
                <div className=" lg:col-span-4 flex flex-col justify-end gap-10 pb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="img flex flex-col gap-2">
                            <h3 className="font-sans text-xl font-bold text-black uppercase">
                                Zewadi
                            </h3>
                            <p className="font-sans text-[#555] text-sm md:text-base leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

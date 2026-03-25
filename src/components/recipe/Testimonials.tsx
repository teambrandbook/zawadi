"use client"



import Image from "next/image";
import { useEffect } from "react";
import { imageAnimation, zoomDeepAnimation } from "../../../lib/animations";

export default function Testimonials() {
    useEffect(() => {
        imageAnimation(".img")
        zoomDeepAnimation(".zoomComponent")
    }, [])
    return (
        <div className=" px-10 ">
            <section className="relative w-full py-32 rounded-[10px] overflow-hidden">
                {/* Background Image */}
                <div className="img absolute inset-0 z-0">
                    <Image
                        src="/community/community-6.webp"
                        alt="Community"
                        fill
                        className="object-cover brightness-[0.8]"
                    />
                </div>

                {/* Testimonial Cards */}
                <div className="zoomComponent relative z-10 max-w-[85rem] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className={`bg-white p-12 flex relative shadow-2xl items-center border-x-[12px] border-[#9F8151]
                    ${i === 2 ? "hidden md:flex" : ""}
                            `}
                        >
                            <div className="flex flex-col gap-8">
                                <span className="text-6xl text-[#9F8151] font-serif leading-none h-8">&quot;</span>

                                <p className="font-sans text-gray-600 leading-relaxed italic pr-4">
                                    Lorem ipsum dolor sit amet...
                                </p>

                                <span className="text-6xl text-[#9F8151] font-serif leading-none h-8 self-end -mt-6">&quot;</span>

                                <div className="flex items-center gap-4 mt-4">
                                    <div className="w-16 h-16 bg-[#9F8151] shrink-0" />
                                    <div className="flex flex-col">
                                        <h4 className="font-bold text-black uppercase">Abdul Hakeem</h4>
                                        <span className="text-sm text-gray-500 italic">Our Guest</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

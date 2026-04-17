"use client";

import Image from "next/image";
import { useEffect } from "react";
import { imageAnimationLeft } from "../../../lib/animations";

export default function StoryCheckerboard() {

    useEffect(() => {
        imageAnimationLeft(".imgl")
    }, [])

    return (
        <section className="w-full bg-white py-0 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 ">

                {/* LEFT SIDE (Block 1 + 2) */}
                <div className="imgl flex flex-row ">

                    {/* Block 1: Image */}
                    <div className=" aspect-square relative w-1/2 min-h-[400px] overflow-hidden bg-[#f0f0f0] ">
                        <Image
                            src="/events/event-2.webp"
                            alt="Event Story 1"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>

                    {/* Block 2: Text */}
                    <div className=" aspect-square bg-[#0A4834] w-1/2 min-h-[400px] p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col justify-center">
                        <h3 className="font-poppins text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-light text-[#EAE3D2] mb-6 lg:mb-8 tracking-tighter leading-[1.1]">
                            What Awaits You
                        </h3>
                        <p className="font-mulish text-[#EAE3D2]/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg font-medium">
                            New experiences, new faces, and a closer look at what Zewadi stands for.
                        </p>
                    </div>

                </div>

                {/* RIGHT SIDE (Block 3 + 4) */}
                <div className="imgl flex flex-row">

                    {/* Block 3: Text */}
                    <div className=" aspect-square w-1/2 bg-[#0A4834]  min-h-[400px] p-8 md:p-12 lg:p-16 xl:p-24 flex flex-col justify-center">
                        <h3 className="font-poppins text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-light text-[#EAE3D2] mb-6 lg:mb-8 tracking-tighter leading-[1.1]">
                            Celebrating Our<br/>Community
                        </h3>
                        <p className="font-mulish text-[#EAE3D2]/90 text-sm md:text-base lg:text-lg leading-relaxed max-w-lg font-medium">
                           Our community means the world to us. That’s why we create moments, offers, and experiences with you in mind.
                        </p>
                    </div>

                    {/* Block 4: Image */}
                    <div className=" aspect-square relative w-1/2 min-h-[400px] overflow-hidden bg-[#f0f0f0]">
                        <Image
                            src="/events/event-3.webp"
                            alt="Event Story 2"
                            fill
                            className="object-cover"
                        />
                    </div>

                </div>

            </div>
        </section>
    );
}

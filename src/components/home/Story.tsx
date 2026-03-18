import Image from "next/image";
import Link from "next/link";

export default function Story() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[90rem] mx-auto flex flex-col items-center">

                {/* Header Section */}
                <div className="text-center max-w-4xl mb-20">
                    <h2 className="font-display text-5xl md:text-7xl font-black text-[#000000] mb-8 uppercase tracking-tighter">
                        Our Story
                    </h2>
                    <p className="font-sans text-[#555] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </p>
                </div>

                {/* Timeline Section */}
                <div className="relative w-full max-w-7xl mb-24 hidden md:block">
                    {/* Horizontal Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#999] -translate-y-1/2 z-0" />

                    <div className="relative z-10 flex justify-between items-center w-full">

                        {/* Node 1: Active (Solid Dark) */}
                        <div className="relative group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-[#0A4834] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 border-4 border-white ring-1 ring-[#0A4834]">
                                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                            </div>
                        </div>

                        {/* Node 2: Inactive (Outline) */}
                        <div className="relative group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-white border border-[#555] flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:border-[#0A4834]">
                                <div className="w-2.5 h-2.5 bg-[#0A4834] rounded-full" />
                            </div>
                        </div>

                        {/* Node 3: Inactive (Outline) */}
                        <div className="relative group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-white border border-[#555] flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:border-[#0A4834]">
                                <div className="w-2.5 h-2.5 bg-[#0A4834] rounded-full" />
                            </div>
                        </div>

                        {/* Node 4: Inactive (Outline) */}
                        <div className="relative group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-white border border-[#555] flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:border-[#0A4834]">
                                <div className="w-2.5 h-2.5 bg-[#0A4834] rounded-full" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Image Grid Section */}
                <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 items-center">

                    {/* Image 1: Vertical */}
                    <div className="col-span-1 aspect-[3/5] relative bg-[#D9D9D9] rounded-sm overflow-hidden shadow-sm md:mt-30">
                        <Image
                            src="/home/section4-1.webp"
                            alt="Story vertical 1"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Image 2: Vertical */}
                    <div className="col-span-1 aspect-[3/5] relative bg-[#D9D9D9] rounded-sm overflow-hidden shadow-sm md:mt-30">
                        <Image
                            src="/home/section4-2.webp"
                            alt="Story vertical 2"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Image 3: Large Square (Spans 2 cols) */}
                    <div className="col-span-1 md:col-span-2 aspect-square relative bg-[#D9D9D9] rounded-sm overflow-hidden shadow-sm md:mt-12">
                        <Image
                            src="/home/section4-3.webp"
                            alt="Story main"
                            fill
                            className="object-cover"
                        />
                    </div>

                </div>



            </div>
        </section>
    );
}

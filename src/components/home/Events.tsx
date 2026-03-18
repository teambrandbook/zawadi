import Image from "next/image";

export default function Events() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Left Column: Title and Toggle */}
                <div className="lg:col-span-5 flex flex-col justify-start pt-4 gap-10">
                    <div>
                        <h2 className="font-display text-5xl md:text-7xl font-black text-[#0A4834] mb-6 uppercase tracking-tighter leading-[0.9]">
                            Where Every Meal <br /> Becomes a Memory
                        </h2>
                        <p className="font-sans text-[#555] text-lg leading-relaxed max-w-md">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
                        </p>
                    </div>

                    {/* Explore More Button */}
                    <div className="w-56 h-16 bg-[#0A4834] rounded-full flex items-center justify-between pl-8 pr-2 shadow-xl cursor-pointer hover:bg-[#083a2a] transition-all hover:scale-105 active:scale-95 group">
                        <span className="font-sans text-white text-[13px] font-black uppercase tracking-widest">
                            Explore More
                        </span>
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#0A4834]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 transform group-hover:translate-x-1 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Column: Timeline Events */}
                <div className="lg:col-span-7 relative pl-4 md:pl-8">

                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[44px] md:left-[60px] top-10 bottom-10 w-[2.5px] bg-[#D4D4D4] z-0" />

                    <div className="flex flex-col gap-16 relative">

                        {/* Event Item 1 (Active) */}
                        <div className="flex gap-8 md:gap-12 relative items-start">
                            {/* Node */}
                            <div className="relative z-10 w-14 h-14 flex-shrink-0 rounded-full bg-[#0A4834] flex items-center justify-center shadow-md">
                                <div className="w-4 h-4 bg-white rounded-full" />
                            </div>

                            {/* Card */}
                            <div className="flex-1 bg-[#E5E5E5] p-6 md:p-8 rounded-sm shadow-sm transition-transform hover:-translate-y-1 duration-300">
                                <h3 className="font-display text-2xl font-bold text-black mb-3 tracking-tight">
                                    Where Every Meal Becomes a Memory
                                </h3>
                                <p className="font-sans text-xs text-[#555] mb-6 leading-relaxed max-w-sm">
                                    Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                                </p>
                                <div className="w-full h-40 relative bg-white rounded-sm shadow-inner overflow-hidden">
                                    <Image fill src="/home/section7-1.webp" alt="Event Image 1" className="object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Event Item 2 (Inactive) */}
                        <div className="flex gap-8 md:gap-12 relative items-start">
                            {/* Node */}
                            <div className="relative z-10 w-14 h-14 flex-shrink-0 rounded-full bg-[#E5E5E5] flex items-center justify-center shadow-md">
                                <div className="w-4 h-4 bg-[#0A4834] rounded-full" />
                            </div>

                            {/* Card */}
                            <div className="flex-1 bg-[#E5E5E5] p-6 md:p-8 rounded-sm shadow-sm transition-transform hover:-translate-y-1 duration-300">
                                <h3 className="font-display text-2xl font-bold text-black mb-3 tracking-tight">
                                    Where Every Meal Becomes a Memory
                                </h3>
                                <p className="font-sans text-xs text-[#555] mb-6 leading-relaxed max-w-sm">
                                    Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
                                </p>
                                <div className="w-full h-40 relative bg-white rounded-sm shadow-inner overflow-hidden">
                                    <Image fill src="/home/section7-2.webp" alt="Event Image 2" className="object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Node (Termination) */}
                        <div className="flex gap-8 md:gap-12 relative items-center">
                            {/* Node Only */}
                            <div className="relative z-10 w-14 h-14 flex-shrink-0 rounded-full bg-[#E5E5E5] flex items-center justify-center shadow-md">
                                <div className="w-4 h-4 bg-[#0A4834] rounded-full" />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

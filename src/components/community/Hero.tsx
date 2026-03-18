import Image from "next/image";

export default function Hero() {
    return (
        <section className="w-full bg-white pt-56 pb-12 md:pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-black tracking-tight leading-none uppercase">
                            Zewadi Community
                        </h1>
                        <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed max-w-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Small Image Placeholder */}
                    <div className="w-full aspect-[4/3] relative rounded-sm overflow-hidden shadow-sm">
                        <Image src="/community/community-1.webp" alt="Community Hero Small" fill className="object-cover" />
                    </div>

                    {/* Secondary Text */}
                    <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed max-w-md">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                    {/* Join Now Button */}
                    <button
                        className="group w-52 h-14 bg-[#0A4834] rounded-full flex items-center justify-between pl-8 pr-1.5 shadow-xl transition-all hover:scale-105 hover:bg-[#083a2a] active:scale-95"
                        aria-label="Join Zewadi Community Now"
                    >
                        <span className="font-sans text-white text-[13px] font-black uppercase tracking-widest transition-all group-hover:tracking-[0.15em]">
                            Join Now
                        </span>
                        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#0A4834] shadow-sm transform transition-all group-hover:translate-x-0.5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 md:h-6 md:w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Right Column - Large Image */}
                <div className="w-full h-full min-h-[500px] lg:min-h-[700px] relative rounded-sm overflow-hidden shadow-sm">
                    <Image src="/community/community-2.webp" alt="Community Hero Large" fill className="object-cover" />
                </div>

            </div>
        </section>
    );
}

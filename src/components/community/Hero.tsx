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

                    {/* Toggle Button */}
                    <button
                        className="group w-48 h-12 bg-[#0A4834] rounded-full flex items-center justify-end px-1.5 shadow-lg cursor-pointer hover:bg-[#1A5A44] transition-all"
                        aria-label="Toggle"
                    >
                        <div className="w-9 h-9 bg-white rounded-full shadow-sm group-hover:scale-105 transition-transform" />
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

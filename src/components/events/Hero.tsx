import Image from "next/image";

export default function Hero() {
    return (
        <section className="w-full bg-white pt-40 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Header */}
                <div className="text-center max-w-3xl mb-12 md:mb-16">
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-black uppercase mb-6 tracking-tight leading-none">
                        ZEWADI Events
                    </h1>
                    <p className="font-sans text-[#555] text-sm md:text-lg leading-relaxed max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Main Card Container */}
                <div className="w-full max-w-5xl bg-[#EAE3D2] rounded-xl p-8 md:p-12">

                    {/* Top Controls Row */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 w-full px-2">
                        <span className="font-sans text-[#0A4834] text-base md:text-xl font-medium text-center md:text-left">
                            Lorem ipsum doloa.
                        </span>

                        {/* Buttons Placeholder */}
                        <div className="flex gap-4">
                            <div className="w-24 md:w-32 h-10 md:h-12 bg-[#D9D9D9] rounded-2xl"></div>
                            <div className="w-24 md:w-32 h-10 md:h-12 bg-[#D9D9D9] rounded-2xl"></div>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="w-full aspect-[4/5] md:aspect-[16/10] rounded-2xl overflow-hidden relative shadow-sm flex flex-col">
                        {/* Image Placeholder Area (Main) - 50% Height */}
                        <div className="flex-1 relative w-full h-1/2">
                            <Image src="/events/event-1.webp" alt="Main Event" fill className="object-cover" />
                        </div>

                        {/* Bottom Dark Bar - 50% Height */}
                        <div className="flex-1 bg-[#0A4834] flex items-center justify-center p-6 md:p-12 text-center">
                            <p className="font-sans text-[#EAE3D2]/80 text-[10px] md:text-sm leading-relaxed max-w-2xl">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                <br className="hidden md:block" />
                                Incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}

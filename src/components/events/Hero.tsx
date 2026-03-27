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
                <div className="w-full max-w-5xl bg-[#EAE3D2] rounded-xl p-8 md:p-12 shadow-sm">

                    {/* Top Controls Row */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 w-full px-2">
                        <span className="font-sans text-[#0A4834] text-base md:text-xl font-bold tracking-tight text-center md:text-left">
                            Lorem ipsum doloa.
                        </span>
                    </div>

                    {/* Media Card */}
                    <div className="w-full aspect-[4/5] md:aspect-[16/10] rounded-2xl overflow-hidden relative shadow-md flex flex-col group">
                        {/* Image Placeholder Area (Main) - 65% Height */}
                        <div className="relative w-full h-[65%] overflow-hidden">
                            <Image 
                                src="/events/event-1.webp" 
                                alt="Main Event" 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                            />
                        </div>

                        {/* Bottom Dark Bar - 35% Height */}
                        <div className="flex-none h-[35%] bg-[#0A4834] flex items-center justify-center p-6 md:px-12 text-center">
                            <p className="font-sans text-[#EAE3D2]/80 text-[10px] md:text-sm leading-relaxed max-w-2xl px-4 font-medium italic">
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

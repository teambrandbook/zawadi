import Image from "next/image";

export default function FeatureStory() {
    return (
        <section className="w-full bg-white py-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">
                
                {/* Main Card Container */}
                <div className="w-full max-w-5xl bg-[#EAE3D2] rounded-3xl p-8 md:p-12 shadow-sm">

                    {/* Top Controls Row */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 w-full px-2">
                        <h2 className="font-display text-[#0A4834] text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-center md:text-left line-clamp-1">
                            Lorem ipsum doloa.
                        </h2>

                        {/* Buttons Placeholder */}
                        <div className="flex gap-4">
                            <div className="w-24 md:w-32 h-10 md:h-12 bg-[#D9D9D9]/80 rounded-2xl cursor-pointer hover:bg-[#D9D9D9] transition-colors" />
                            <div className="w-24 md:w-32 h-10 md:h-12 bg-[#D9D9D9]/80 rounded-2xl cursor-pointer hover:bg-[#D9D9D9] transition-colors" />
                        </div>
                    </div>

                    {/* Media Card - 50/50 Split */}
                    <div className="w-full aspect-[4/5] md:aspect-[16/10] rounded-[2rem] overflow-hidden relative shadow-xl flex flex-col">
                        {/* Top: Image (50%) */}
                        <div className="flex-1 relative w-full">
                            <Image 
                                src="/community/community-6.webp" 
                                alt="Community Feature" 
                                fill 
                                className="object-cover" 
                            />
                        </div>

                        {/* Bottom: Dark Green Text Box (50%) */}
                        <div className="flex-1 bg-[#0A4834] flex items-center justify-center p-8 md:p-16 lg:p-24 text-center">
                            <p className="font-sans text-[#EAE3D2] text-sm md:text-lg lg:text-xl leading-relaxed max-w-3xl opacity-90">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                <br className="hidden md:block" />
                                Incididunt ut labore et dolore magna aliqua.
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

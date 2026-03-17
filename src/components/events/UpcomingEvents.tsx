import Image from "next/image";

export default function UpcomingEvents() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col gap-12">

                {/* Header */}
                <div className="flex flex-col gap-4 max-w-3xl">
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none uppercase">
                        Upcoming Events
                    </h2>
                    <p className="font-sans text-[#555] text-base md:text-lg leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, s
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Card 1 */}
                    <div className="bg-[#D9D9D9] p-8 md:p-12 rounded-sm aspect-square md:aspect-[4/3] flex flex-col justify-end relative overflow-hidden group">
                        <Image src="/events/event-4.webp" alt="Event 4" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 z-0"></div>
                        <div className="relative z-10 flex items-end justify-between w-full">
                            <div className="flex flex-col gap-2">
                                <h3 className="font-display text-3xl md:text-4xl font-black text-white leading-tight">
                                    Upcoming <br /> Events
                                </h3>
                                <p className="font-sans text-white/90 text-sm md:text-base">
                                    Lorem ipsum dolor
                                </p>
                            </div>

                            {/* Button */}
                            <button className="w-32 md:w-40 h-10 md:h-12 bg-[#0A4834] rounded-full hover:bg-[#1a2c2c] transition-colors shadow-lg"></button>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#D9D9D9] p-8 md:p-12 rounded-sm aspect-square md:aspect-[4/3] flex flex-col justify-end relative overflow-hidden group">
                        <Image src="/events/event-5.webp" alt="Event 5" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 z-0"></div>
                        <div className="relative z-10 flex items-end justify-between w-full">
                            <div className="flex flex-col gap-2">
                                <h3 className="font-display text-3xl md:text-4xl font-black text-white leading-tight">
                                    Upcoming <br /> Events
                                </h3>
                                <p className="font-sans text-white/90 text-sm md:text-base">
                                    Lorem ipsum dolor
                                </p>
                            </div>

                            {/* Button */}
                            <button className="w-32 md:w-40 h-10 md:h-12 bg-[#0A4834] rounded-full hover:bg-[#1a2c2c] transition-colors shadow-lg"></button>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}

import Image from "next/image";

export default function StoryCheckerboard() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2">

                {/* Block 1: Image (Top Left) */}
                <div className="aspect-square relative w-full h-full min-h-[400px]">
                    <Image src="/events/event-2.webp" alt="Event Story 1" fill className="object-cover" />
                </div>

                {/* Block 2: Text (Top Right) */}
                <div className="aspect-square bg-[#0A4834] w-full h-full min-h-[350px] md:min-h-[400px] p-6 md:p-10 lg:p-16 flex flex-col justify-center">
                    <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6 uppercase tracking-tight">
                        Zewadi story
                    </h3>
                    <p className="font-sans text-white/80 text-xs md:text-sm lg:text-base leading-relaxed overflow-hidden">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Block 3: Text (Bottom Left) */}
                <div className="aspect-square bg-[#0A4834] w-full h-full min-h-[350px] md:min-h-[400px] p-6 md:p-10 lg:p-16 flex flex-col justify-center order-last md:order-none">
                    <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6 uppercase tracking-tight">
                        Zewadi story
                    </h3>
                    <p className="font-sans text-white/80 text-xs md:text-sm lg:text-base leading-relaxed overflow-hidden">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Block 4: Image (Bottom Right) */}
                <div className="aspect-square relative w-full h-full min-h-[400px]">
                    <Image src="/events/event-3.webp" alt="Event Story 2" fill className="object-cover" />
                </div>

            </div>
        </section>
    );
}

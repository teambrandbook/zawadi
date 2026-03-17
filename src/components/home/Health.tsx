import Image from "next/image";

export default function Health() {
    return (
        <section className="w-full bg-[#0A4834] py-24 px-6 md:px-12 lg:px-24 overflow-hidden relative">
            <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">

                {/* Left Column: Text Content */}
                <div className="lg:col-span-3 flex flex-col gap-8 z-10 relative">
                    <h2 className="font-display text-5xl md:text-7xl font-black text-white mb-2 uppercase tracking-tighter leading-[0.9]">
                        Where Every Meal <br /> Becomes a Memory
                    </h2>
                    <p className="font-sans text-gray-300 text-lg leading-relaxed max-w-lg">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia.
                    </p>
                </div>

                {/* Right Column: Image Shape */}
                <div className="lg:col-span-2 relative h-[400px] md:h-[600px] w-full lg:w-[180%] lg:-mr-[80%] z-10 flex justify-end">
                    {/* The shape is a large rounded rectangle/pill coming from the right */}
                    <div className="relative w-full h-full bg-[#D9D9D9] rounded-l-full overflow-hidden shadow-2xl">
                        <Image
                            src="/home/section8.webp"
                            alt="Health and Wellness"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}

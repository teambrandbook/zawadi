import Image from "next/image";

export default function Developing() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto flex flex-col">

                {/* Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h2 className="font-display text-5xl md:text-7xl font-black text-[#000000] mb-8 uppercase tracking-tighter leading-[0.9]">
                        Where Every Meal <br /> Becomes a Memory
                    </h2>
                    <p className="font-sans text-[#555] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

                    {/* Left Column (Tall Image + Button) - Spans 5 cols */}
                    <div className="md:col-span-5 flex flex-col gap-12">
                        {/* Tall Vertical Image */}
                        <div className="w-full aspect-[3/4] relative bg-[#D9D9D9] rounded-sm overflow-hidden shadow-sm">
                            <Image
                                src="/home/section5-1.webp"
                                alt="Meal memory vertical"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Toggle Button layout */}
                        <div className="w-48 h-14 bg-[#0A4834] rounded-full flex items-center justify-end px-1.5 shadow-lg cursor-pointer hover:bg-[#3A5A5A] transition-colors relative">
                            <div className="w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center">
                                {/* Optional Icon */}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Wide Image + Text) - Spans 7 cols */}
                    <div className="md:col-span-7 flex flex-col gap-12">
                        {/* Wide Image */}
                        <div className="w-full aspect-[5/3] relative bg-[#D9D9D9] rounded-sm overflow-hidden shadow-sm">
                            <Image
                                src="/home/section5-2.webp"
                                alt="Meal memory horizontal"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Text Block */}
                        <p className="font-sans text-[#555] text-lg leading-relaxed max-w-xl">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

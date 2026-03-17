import Image from "next/image";

export default function CommunityFeature() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

                {/* Column 1: Large Vertical Image (Left) */}
                <div className="lg:col-span-4 flex items-start">
                    <div className="w-full aspect-[2/3] relative rounded-sm overflow-hidden shadow-sm">
                        <Image src="/community/community-6.webp" alt="Feature 1" fill className="object-cover" />
                    </div>
                </div>

                {/* Column 2: Title + Middle Image */}
                <div className="lg:col-span-4 flex flex-col items-center">
                    {/* Title Area */}
                    <div className="mb-12 text-center">
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-black uppercase leading-[0.9] tracking-tight">
                            Zewadi <br /> Community
                        </h2>
                    </div>

                    {/* Middle Image - Offset downwards and slightly smaller height than left one perhaps, or just shifted */}
                    <div className="w-full aspect-[2/3] relative rounded-sm overflow-hidden shadow-sm lg:mt-12">
                        <Image src="/community/community-7.webp" alt="Feature 2" fill className="object-cover" />
                    </div>
                </div>

                {/* Column 3: Text List (Right) */}
                <div className="lg:col-span-4 flex flex-col justify-center gap-10 lg:pl-8 pt-12 lg:pt-32">

                    {/* Text Item 1 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-display text-2xl font-bold text-black">
                            Zewadi
                        </h3>
                        <p className="font-sans text-[#555] text-sm leading-relaxed max-w-xs">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Text Item 2 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-display text-2xl font-bold text-black">
                            Zewadi
                        </h3>
                        <p className="font-sans text-[#555] text-sm leading-relaxed max-w-xs">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Text Item 3 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-display text-2xl font-bold text-black">
                            Zewadi
                        </h3>
                        <p className="font-sans text-[#555] text-sm leading-relaxed max-w-xs">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

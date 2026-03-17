import Image from "next/image";

export default function CommunityListing() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                {/* Left Column: Title, Intro, Image */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    {/* Title & Text */}
                    <div className="flex flex-col gap-4">
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-black uppercase leading-[0.9] tracking-tight">
                            Zewadi <br /> Community
                        </h2>
                        <p className="font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Image Placeholder */}
                    <div className="w-full aspect-[4/3] relative rounded-sm overflow-hidden shadow-sm">
                        <Image src="/community/community-8.webp" alt="Community Listing" fill className="object-cover" />
                    </div>
                </div>

                {/* Right Column: 2x2 Grid of Text Items */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 py-4">

                    {/* Item 1 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-display text-2xl font-bold text-black">
                            Zewadi
                        </h3>
                        <p className="font-sans text-[#555] text-sm leading-relaxed max-w-xs">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-display text-2xl font-bold text-black">
                            Zewadi
                        </h3>
                        <p className="font-sans text-[#555] text-sm leading-relaxed max-w-xs">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-display text-2xl font-bold text-black">
                            Zewadi
                        </h3>
                        <p className="font-sans text-[#555] text-sm leading-relaxed max-w-xs">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    {/* Item 4 */}
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

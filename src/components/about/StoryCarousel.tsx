import Image from "next/image";

export default function StoryCarousel() {
    return (
        <section className="w-full bg-[#0A4834] py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Title */}
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-[#EAE3D2] text-center mb-16 md:mb-24 tracking-tight leading-[0.9]">
                    The story behind the <br /> flavors
                </h2>

                {/* Carousel / Cards Container */}
                <div className="relative w-full max-w-6xl h-[400px] md:h-[500px] flex items-center justify-center mb-16">

                    {/* Left Card (Hidden on mobile, visible on larger screens) */}
                    {/* Positioned relative to center card or absolute */}
                    <div className="absolute left-1/2 -translate-x-[115%] w-[280px] md:w-[350px] lg:w-[400px] aspect-square bg-white rounded-sm shadow-xl z-0 hidden md:block scale-90 opacity-90 overflow-hidden">
                        <Image src="/about/about-3.3.webp" alt="Story Carousel Left" fill className="object-cover" />
                    </div>

                    {/* Right Card (Hidden on mobile) */}
                    <div className="absolute right-1/2 translate-x-[115%] w-[280px] md:w-[350px] lg:w-[400px] aspect-square bg-white rounded-sm shadow-xl z-0 hidden md:block scale-90 opacity-90 overflow-hidden">
                        <Image src="/about/about-2.2.webp" alt="Story Carousel Right" fill className="object-cover" />
                    </div>

                    {/* Center Card (Primary) */}
                    <div className="relative w-[300px] md:w-[400px] lg:w-[480px] aspect-square bg-white rounded-sm shadow-2xl z-20 overflow-hidden">
                        <Image src="/about/about-4.4.webp" alt="Story Carousel Center" fill className="object-cover" />
                    </div>
                </div>

                {/* Bottom Text */}
                <p className="font-sans text-[#EAE3D2] text-center text-sm md:text-base leading-relaxed max-w-3xl mx-auto px-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

            </div>
        </section>
    );
}

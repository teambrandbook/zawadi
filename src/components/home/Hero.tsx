import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-white">
            {/* Background Shape with Drop Shadow */}
            <div className="absolute inset-0 w-full h-full filter drop-shadow-2xl z-0 pointer-events-none">
                <div
                    className="w-full h-full relative"
                    style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)"
                    }}
                >
                    <Image
                        src="/home/hero-section.webp"
                        alt="Zewadi Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/35 z-10" />
                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center justify-center h-full pt-32">

                {/* Main Heading */}
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-2 text-white drop-shadow-lg uppercase">
                    The Zewadi Way of Living
                </h1>

                {/* Subheading */}
                <h2 className="text-[#D4A5A5] text-lg md:text-2xl font-sans font-medium mb-6 tracking-wide drop-shadow-md">
                    Building a Healthier Society, Together
                </h2>

                {/* Description Text */}
                <p className="max-w-xl text-gray-200 text-base md:text-lg leading-relaxed mb-10 drop-shadow-sm font-light">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                {/* CSS Button */}
                <button
                    className="w-48 h-12 bg-[#D9D9D9] hover:bg-white transition-all rounded-full shadow-lg cursor-pointer"
                    aria-label="Learn More"
                />
            </div>
        </section>
    );
}

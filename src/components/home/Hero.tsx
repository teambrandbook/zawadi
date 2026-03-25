"use client";
import WipeButton from "../shared/WipeButton";

export default function Hero() {
    return (
        <section className="relative w-full h-[110vh] min-h-[100px] overflow-hidden bg-white">
            {/* Background Shape with Drop Shadow */}
            <div className="absolute inset-0 w-full h-full filter drop-shadow-2xl z-0 pointer-events-none">
                <div
                    className="w-full h-full relative"
                    style={{
                        clipPath: "ellipse(65% 100% at 50% 0%)"
                    }}
                >
                    <video
                        src="/home/homepage-herosection.webm"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/35 z-10" />


                </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center justify-center h-full pt-32">

                {/* Main Heading */}
                <h1 className="font-display text-5xl md:text-[5.5rem] font-bold tracking-tight text-white mb-4 leading-none uppercase drop-shadow-lg">
                    The Zewadi Way of Living
                </h1>

                {/* Subheading */}
                <h2 className="text-white text-xl md:text-3xl font-display font-normal mb-8 tracking-wide drop-shadow-md">
                    Building a Healthier Society, Together
                </h2>

                {/* Description Text */}
                <p className="max-w-3xl text-white text-base md:text-lg leading-relaxed mb-12 font-sans font-light drop-shadow-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br className="hidden md:block" />
                    tempor incididunt ut labore et dolore magna aliqua.
                </p>

                {/* Explore More Button - Minimal Beige Variant */}
                <WipeButton
                    href="/about"
                    label="Explore More"
                    variant="beige"
                    showIcon={false}
                />
            </div>
        </section>
    );
}

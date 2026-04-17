"use client";
import WipeButton from "../shared/WipeButton";

export default function Hero() {
    return (
        <section className="relative w-full h-[110vh] min-h-[100px] overflow-hidden bg-white">
            {/* Background Shape with Drop Shadow */}
            <div className="absolute inset-0 w-full h-full filter drop-shadow-2xl z-0 pointer-events-none">
                <div
                    className="
    w-full h-full relative
    [clip-path:ellipse(80%_80%_at_50%_0%)]
    md:[clip-path:ellipse(75%_80%_at_50%_0%)]
    lg:[clip-path:ellipse(70%_90%_at_50%_0%)]
  "
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
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center justify-center h-full md:pt-32">

                {/* Main Heading */}
                <h1 className="font-display text-5xl md:text-[4rem] font-light tracking-tight text-white mb-8 leading-[1.1] drop-shadow-lg">
                    The Zewadi Way of Living
                </h1>

                {/* Subheading */}
                <h2 className="text-white text-xl md:text-3xl font-voltaire font-normal mb-8 tracking-wide drop-shadow-md">
                    Building a Healthier Society, Together
                </h2>

                {/* Description Text */}
                <p className="max-w-3xl text-white text-base md:text-lg leading-relaxed mb-12 font-mulish font-light drop-shadow-sm">
                    Wellness doesn’t start with big leaps. It’s all those small choices you make every day that add up and slowly shape how you live. That’s the heart of Zewadi—making that shift feel natural, easy, and honestly, something you want to keep doing. <br className="hidden md:block" />
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

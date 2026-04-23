import Image from "next/image";

export default function Newsletter() {
    return (
        <section className="w-full bg-white py-12 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            {/* Dark Container */}
            <div className="w-full max-w-[85rem] mx-auto bg-[#0A4834] rounded-sm overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10">

                {/* Left Column: Text */}
                <div className="flex-1 p-12 md:p-16 flex flex-col justify-center gap-6 z-20">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-light text-white tracking-tighter leading-tight uppercase">
                            NEWS LETTER
                        </h2>
                        <p className="font-mulish text-gray-300 text-sm md:text-base tracking-wide font-light uppercase opacity-80">
                            Sign In for remainders
                        </p>
                    </div>

                    <p className="font-mulish text-white/90 text-sm md:text-lg leading-relaxed max-w-md">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Right Column: Image Box */}
                <div className="flex-1 relative min-h-[350px] md:min-h-auto flex justify-end items-end px-8 md:px-12 pt-8 md:pt-24 z-10">
                    {/* The image box */}
                    <div className="w-full lg:w-[88%] aspect-square bg-[#D9D9D9] rounded-sm shadow-xl relative overflow-hidden">
                        <Image
                            src="/home/section9.webp"
                            alt="Newsletter"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}

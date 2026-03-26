import Image from "next/image";

export default function Newsletter() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            {/* Dark Container */}
            <div className="w-full max-w-[85rem] mx-auto bg-[#0A4834] rounded-sm overflow-hidden flex flex-col md:flex-row shadow-2xl">

                {/* Left Column: Text */}
                <div className="flex-1 p-12 md:p-16 flex flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                            NEWS LETTER
                        </h2>
                        <p className="font-sans text-gray-300 text-sm tracking-wide font-light">
                            Sign In for remainders
                        </p>
                    </div>
                    <p className="font-sans text-white text-lg leading-relaxed max-w-md opacity-90">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Right Column: Placeholder Box */}
                <div className="flex-1 relative min-h-[300px] md:min-h-auto flex justify-end items-end px-8 md:px-12 pt-8 md:pt-12">
                    {/* The image box */}
                    <div className="w-full md:w-[88%] aspect-square md:aspect-[4/4] bg-[#D9D9D9] rounded-sm shadow-lg relative">
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

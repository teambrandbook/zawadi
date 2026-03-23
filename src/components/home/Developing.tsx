import Image from "next/image";
import Link from "next/link";

export default function Developing() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Header Section */}
                <div className="text-center max-w-4xl mb-20 flex flex-col items-center gap-6">
                    <h2 className="font-display text-5xl md:text-7xl font-bold text-[#000000] tracking-tight leading-tight">
                        Where Every Meal Becomes a Memory
                    </h2>
                    <p className="font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-3xl">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* Left Column: Tall Image + Pill Toggle */}
                    <div className="flex flex-col gap-10">
                        <div className="w-full aspect-[3/4] relative bg-[#D9D9D9] rounded-sm overflow-hidden shadow-sm">
                            <Image
                                src="/home/section5-1.webp"
                                alt="Meal memory vertical"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Pill Learn More Button */}
                        <Link href="/community" className="w-52 h-14 bg-[#0A4834] rounded-full flex items-center justify-between pl-8 pr-1.5 shadow-xl cursor-pointer group hover:bg-[#083a2a] transition-all">
                            <span className="font-sans text-white text-[13px] font-black uppercase tracking-widest">
                                Learn More
                            </span>
                            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-[#0A4834]">
                                <svg
                                    className="h-5 w-5 transform group-hover:translate-x-0.5 transition-transform"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <rect x="3" y="11" width="5" height="2.5" rx="1.25" />
                                    <path d="M10 8c0-1.1 1.2-1.8 2.1-1.3l6.3 3.6c.9.5.9 1.9 0 2.4l-6.3 3.6c-.9.5-2.1-.2-2.1-1.3V8z" />
                                </svg>
                            </div>
                        </Link>
                    </div>

                    {/* Right Column: Wide Image + Descriptive Text */}
                    <div className="flex flex-col gap-10">
                        <div className="w-full aspect-[4/3] relative bg-[#D9D9D9] rounded-sm overflow-hidden shadow-sm">
                            <Image
                                src="/home/section5-2.webp"
                                alt="Meal memory horizontal"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="font-sans text-[#555] text-sm md:text-[15px] leading-relaxed max-w-xl">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

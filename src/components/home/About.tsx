import Image from "next/image";

export default function About() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-y-16 gap-x-20 items-start">

                {/* Row 1, Col 1: Main Text Content */}
                <div className="flex flex-col justify-center pt-8">
                    <h2 className="font-display text-5xl md:text-7xl font-extrabold text-[#000000] mb-6 tracking-tight leading-[0.9]">
                        Zewadi <br /> Community
                    </h2>
                    <p className="font-sans text-[#555] text-lg leading-relaxed max-w-sm mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Row 1, Col 2: Large Image Placeholder */}
                <div className="w-full h-80 md:h-[28rem] relative rounded-sm overflow-hidden shadow-sm">
                    <Image
                        src="/home/section2-3.webp"
                        alt="Zewadi Community Actions"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Row 2, Col 1: Two Vertical Images */}
                <div className="flex gap-6 h-80 md:h-[28rem]">
                    <div className="flex-1 relative rounded-sm overflow-hidden shadow-sm">
                        <Image
                            src="/home/section2-1.webp"
                            alt="Fresh Vegetables Market"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 relative rounded-sm overflow-hidden shadow-sm">
                        <Image
                            src="/home/section2-2.webp"
                            alt="Smiling Person with Groceries"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Row 2, Col 2: Secondary Text Content + Button */}
                <div className="flex flex-col justify-center pt-8">
                    <h3 className="font-display text-4xl md:text-5xl font-bold text-[#000000] mb-6 tracking-tight">
                        Eat Fresh. Live Well.
                    </h3>
                    <p className="font-sans text-[#555] text-lg leading-relaxed max-w-sm mb-10">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                    {/* Custom Toggle-style Button */}
                    <div className="w-48 h-14 bg-[#0A4834] rounded-full flex items-center justify-end px-1.5 shadow-lg cursor-pointer hover:bg-[#3A5A5A] transition-colors relative">
                        <div className="w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center">
                            {/* Optional Arrow Icon */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 18L15 12L9 6" stroke="#0A4834" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

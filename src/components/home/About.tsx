import Image from "next/image";

export default function About() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-24 md:gap-32">
                
                {/* Row 1: Text Left, Large Image Right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 items-center">
                    <div className="flex flex-col gap-6 order-1">
                        <h2 className="font-display text-5xl md:text-7xl font-black text-black leading-tight uppercase tracking-tighter">
                            Zewadi Community
                        </h2>
                        <p className="font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-md">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 
                        </p>
                    </div>
                    <div className="relative aspect-[16/11] w-full bg-[#f0f0f0] rounded-sm overflow-hidden shadow-sm order-2 group">
                        <Image 
                            src="/home/section2-3.webp" 
                            alt="Zewadi Community Activities" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Row 2: Two Vertical Images Left, Headline & Button Right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 items-center">
                    <div className="flex gap-4 md:gap-6 order-2 md:order-1 h-80 md:h-[28rem]">
                        <div className="relative w-1/2 rounded-sm overflow-hidden shadow-sm group">
                            <Image 
                                src="/home/section2-1.webp" 
                                alt="Fresh market produce" 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <div className="relative w-1/2 rounded-sm overflow-hidden shadow-sm group">
                            <Image 
                                src="/home/section2-2.webp" 
                                alt="Zewadi customer or partner" 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-10 order-1 md:order-2 items-start">
                        <div className="flex flex-col gap-6">
                            <h3 className="font-display text-4xl md:text-6xl font-black text-black leading-tight tracking-tighter">
                                Eat Fresh. <br /> Live Well.
                            </h3>
                            <p className="font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-[400px]">
                                Redefining your food experience with technology and sustainable agriculture. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>
                        
                        {/* Premium Button Style from Screenshot */}
                        <button className="group relative flex items-center bg-[#0A4834] hover:bg-[#083a2a] text-white pl-8 pr-1.5 py-1.5 rounded-full transition-all shadow-xl active:scale-95 border border-transparent">
                            <span className="font-sans font-bold mr-6 text-sm uppercase tracking-widest">
                                Explore More
                            </span>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-[#0A4834] overflow-hidden">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5 md:h-6 md:w-6 transform group-hover:translate-x-1 transition-transform" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

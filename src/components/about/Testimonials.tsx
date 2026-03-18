import Image from "next/image";

export default function Testimonials() {
    return (
        <section className="relative w-full py-24 px-6 md:px-12 lg:px-24">
            <Image src="/about/about-6.6.webp" alt="Testimonials Background" fill className="object-cover z-0" />
            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Single Feedback Card */}
                <div className="bg-white flex w-full h-auto min-h-[350px] shadow-lg rounded-sm overflow-hidden p-3 md:p-5">
                    
                    {/* Left Navigation Arrow */}
                    <div className="w-10 md:w-12 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#b09363] transition-colors shrink-0">
                        <span className="text-xl text-white font-light">&lt;</span>
                    </div>

                    {/* Feedback Content */}
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center gap-8">
                        <p className="font-sans text-[#333] text-base md:text-lg lg:text-xl leading-relaxed font-medium">
                            “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.”
                        </p>
                        <div className="flex items-center gap-5 mt-auto">
                            <div className="w-14 h-14 bg-[#9F8151] rounded-sm shrink-0 overflow-hidden relative">
                                <Image src="/about/about.webp" alt="Avatar" fill className="object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold text-black text-base">Abdul Hakkem</span>
                                <span className="font-sans text-[#555] text-sm">Our Guest</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Navigation Arrow */}
                    <div className="w-10 md:w-12 bg-[#9F8151] flex items-center justify-center cursor-pointer hover:bg-[#b09363] transition-colors shrink-0">
                        <span className="text-xl text-white font-light">&gt;</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

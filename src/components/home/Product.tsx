import Image from "next/image";

export default function Product() {
    return (
        <section className="w-full bg-white py-16 md:py-24 flex justify-center">
            <div className="w-[95%] lg:w-[90%] max-w-[90rem] bg-[#9F8151] mx-auto relative pt-16 md:pt-24 pb-16 md:pb-20 px-6 md:px-16 lg:px-24 rounded-sm">

                {/* Header - Top Left */}
                <h2 className="font-display text-5xl md:text-7xl font-bold text-[#EAE3D2] mb-12 tracking-tighter text-left z-10 relative">
                    Our Product
                </h2>

                {/* Central Composition */}
                <div className="relative w-full flex flex-col items-center justify-center py-4 md:py-10">

                    {/* Carousel Background Images (Placeholders) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[85%] lg:w-[75%] h-56 md:h-80 flex justify-between items-center z-0 px-2 md:px-0">
                        {/* Left Side Image */}
                        <div className="relative w-[40%] md:w-[36%] lg:w-[38%] h-full md:h-[26rem] shadow-xl overflow-hidden rounded-sm">
                            <Image src="/home/section6-1.webp" alt="Side product 1" fill className="object-cover" />
                        </div>
                        {/* Right Side Image */}
                        <div className="relative w-[40%] md:w-[36%] lg:w-[38%] h-full md:h-[26rem] shadow-xl overflow-hidden rounded-sm">
                            <Image src="/home/section6-right.webp" alt="Side product 2" fill className="object-cover" />
                        </div>
                    </div>

                    {/* Product Image (Dark Square) */}
                    <div className="relative z-10 w-80 h-80 md:w-[28rem] lg:w-[30rem] md:h-[38rem] lg:h-[40rem] bg-transparent flex items-center justify-center shadow-2xl overflow-hidden rounded-sm mt-8 md:mt-24">
                        {/* Placeholder for actual product image */}
                        <Image
                            src="/home/section6-center.webp"
                            alt="Our Product"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Description Text */}
                    <div className="relative z-10 mt-16 md:mt-20 max-w-2xl text-center px-4">
                        <p className="font-sans text-[#EAE3D2] text-sm md:text-base leading-relaxed font-light">
                            Bridging the gap between technology and agriculture to redefine your food<br className="hidden md:block"/>experience.Amet minim mollit non deserunt ullamco
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

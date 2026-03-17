import Image from "next/image";

export default function Hero() {
    return (
        <section className="w-full bg-white pt-40 pb-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                {/* Left Column: Images */}
                <div className="flex flex-col gap-10">
                    {/* Main Image */}
                    <div className="w-full aspect-square relative rounded-sm overflow-hidden shadow-sm">
                        <Image src="/product/product-1.webp" alt="Buckwheat" fill className="object-cover" />
                    </div>

                    {/* Thumbnails - Three Circles instead of small squares */}
                    <div className="flex justify-between items-center px-4">
                        <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-2 border-transparent shadow-md hover:scale-105 transition-transform">
                            <Image src="/product/product-2.webp" alt="Thumb 1" fill className="object-cover" />
                        </div>
                        <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-2 border-transparent shadow-md hover:scale-105 transition-transform">
                            <Image src="/product/product-3.webp" alt="Thumb 2" fill className="object-cover" />
                        </div>
                        <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-2 border-transparent shadow-md hover:scale-105 transition-transform">
                            <Image src="/product/product-4.webp" alt="Thumb 3" fill className="object-cover" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className="flex flex-col">

                    {/* Title & Price */}
                    <div className="mb-8">
                        <h1 className="font-display text-5xl md:text-6xl font-black text-black uppercase tracking-tight leading-none mb-4">
                            BUCKWHEAT
                        </h1>
                        <p className="font-sans text-xl font-bold text-black">
                            $ 120.00 USD
                        </p>
                    </div>

                    {/* Description */}
                    <p className="font-sans text-[#555] text-base leading-relaxed mb-8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
                    </p>

                    {/* Benefits */}
                    <div className="mb-10">
                        <h3 className="font-display text-lg font-bold text-black mb-4">Benefits</h3>
                        <ul className="list-disc list-outside ml-5 space-y-2 font-sans text-[#555] text-sm md:text-base leading-relaxed">
                            <li>Only the finest local and seasonal ingredients.</li>
                            <li>Healthy, chemical-free components for every dish.</li>
                            <li>Supporting local farmers and sustainable produce.</li>
                            <li>Each ingredient carefully selected for peak flavor.</li>
                            <li>Ingredients that celebrate each season's best flavors.</li>
                            <li>Top-quality meats, seafood, and plant-based options.</li>
                            <li>Freshly baked, handmade, or house-prepared items.</li>
                        </ul>
                    </div>

                    {/* Swatches */}
                    <div className="flex gap-4 mb-16">
                        <div className="w-12 h-8 bg-[#0A4834] cursor-pointer hover:ring-2 ring-black ring-offset-2 transition-all"></div>
                        <div className="w-24 h-8 bg-[#0A4834] cursor-pointer hover:ring-2 ring-black ring-offset-2 transition-all"></div>
                    </div>

                    {/* Bottom Split Section: Zewadi Stories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-auto">

                        {/* Story Col 1 */}
                        <div className="flex flex-col items-start gap-4">
                            <h4 className="font-display text-2xl font-bold text-black">Zewadi story</h4>
                            <p className="font-sans text-[#555] text-xs leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <button className="w-44 h-10 bg-[#0A4834] hover:bg-[#1A5A44] transition-colors rounded-sm mt-2"></button>
                        </div>

                        {/* Story Col 2 */}
                        <div className="flex flex-col items-start gap-4">
                            <h4 className="font-display text-2xl font-bold text-black">Zewadi story</h4>
                            <p className="font-sans text-[#555] text-xs leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

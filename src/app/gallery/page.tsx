import Navbar from "@/components/community/Navbar";
import Footer from "@/components/shared/Footer";
import Image from "next/image";

export default function GalleryPage() {
    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Navbar />
            
            <section className="pt-44 pb-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-[85rem] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none">
                            Zewadi Events Gallery
                        </h1>
                    </div>

                    {/* Asymmetrical Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* Top Row: Narrow Vertical + Wide Horizontal */}
                        <div className="md:col-span-4 aspect-[4/5] relative rounded-none overflow-hidden shadow-xl">
                            <Image src="/events/event-1.webp" alt="Gallery 1" fill className="object-cover" />
                        </div>
                        <div className="md:col-span-8 aspect-[16/9] relative rounded-none overflow-hidden shadow-xl">
                            <Image src="/events/event-5.webp" alt="Gallery 2" fill className="object-cover" />
                        </div>

                        {/* Mid Row: Wide Horizontal + Square-ish Vertical */}
                        <div className="md:col-span-8 aspect-[16/9] relative rounded-none overflow-hidden shadow-xl">
                            <Image src="/community/community-1.webp" alt="Gallery 3" fill className="object-cover" />
                        </div>
                        <div className="md:col-span-4 aspect-square relative rounded-none overflow-hidden shadow-xl">
                            <Image src="/events/event-2.webp" alt="Gallery 4" fill className="object-cover" />
                        </div>

                        {/* Large Banner Row */}
                        <div className="md:col-span-12 aspect-[21/9] relative rounded-none overflow-hidden shadow-xl">
                            <Image src="/events/event-3.webp" alt="Gallery 5" fill className="object-cover" />
                        </div>

                        {/* Bottom Row: Two Vertical-ish */}
                        <div className="md:col-span-5 aspect-[4/5] relative rounded-none overflow-hidden shadow-xl">
                            <Image src="/community/community-3.webp" alt="Gallery 6" fill className="object-cover" />
                        </div>
                        <div className="md:col-span-7 aspect-square relative rounded-none overflow-hidden shadow-xl">
                            <Image src="/community/community-6.webp" alt="Gallery 7" fill className="object-cover" />
                        </div>

                        {/* Last Row: Vertical Columns */}
                        <div className="md:col-span-6 aspect-[4/5] relative rounded-none overflow-hidden shadow-xl">
                            <Image src="/community/community-8.webp" alt="Gallery 8" fill className="object-cover" />
                        </div>
                        <div className="md:col-span-6 aspect-[4/5] relative rounded-none overflow-hidden shadow-xl">
                            <Image src="/events/event-4.webp" alt="Gallery 9" fill className="object-cover" />
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}

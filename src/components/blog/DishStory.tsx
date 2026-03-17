import Image from "next/image";
import Link from "next/link";

interface DishStoryProps {
    image: string;
    slug?: string;
}

export default function DishStory({ image, slug }: DishStoryProps) {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Header Text */}
                <div className="text-center max-w-4xl mb-12 flex flex-col gap-6">
                    <h2 className="font-display text-4xl md:text-5xl font-black text-black tracking-tight leading-none">
                        Every dish tells a story
                    </h2>
                    <p className="font-sans text-[#555] text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur .
                    </p>
                </div>

                {/* Image Placeholder */}
                <div className="w-full aspect-[16/10] rounded-sm shadow-sm relative overflow-hidden mb-16">
                    <Image src={image} alt="Dish Story" fill className="object-cover" />
                </div>

                {/* Bottom Long Text */}
                <div className="text-center max-w-4xl mx-auto flex flex-col items-center gap-8">
                    <div className="flex flex-col gap-6">
                        <p className="font-sans text-[#555] text-sm md:text-base leading-relaxed">
                            Welcome to our culinary world, where every plate tells a story of dedication, creativity, and flavor. Our chefs pour their passion into every step of the process—from sourcing the best local ingredients to creating dishes that delight the senses.
                        </p>
                        <p className="font-sans text-[#555] text-sm md:text-base leading-relaxed">
                            At the heart of our restaurant is a love for fresh, seasonal ingredients and flavors that excite the palate. In this blog, we take you on a flavorful journey—highlighting the ingredients that make our dishes special, the inspiration for our seasonal menus, and the stories that connect food, culture, and creativity. Discover how our chefs carefully craft each dish to ensure every bite is balanced, vibrant, and memorable, whether it’s a classic recipe or a seasonal innovation.
                        </p>
                    </div>
                    
                    <Link 
                        href={`/blog/${slug || "recipe-4"}`} 
                        className="w-48 h-12 bg-[#0A4834] hover:bg-[#1A5A44] transition-colors rounded-full shadow-md flex items-center justify-center text-white font-sans font-bold text-sm uppercase tracking-widest"
                    >
                        Read More
                    </Link>
                </div>

            </div>
        </section>
    );
}

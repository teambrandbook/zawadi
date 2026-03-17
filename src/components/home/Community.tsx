import Link from "next/link";
import Image from "next/image";

export default function Community() {
    return (
        <section className="relative w-full overflow-hidden mb-[-1px]">

            {/* The Irregular Section */}
            <div className="relative w-full py-32">
                <Image
                    src="/home/section-3.webp"
                    alt="Zewadi Community"
                    fill
                    className="object-cover"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/35 z-0" />

                {/* Top Wavy Edge (White overlay) */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10">
                    <svg className="relative block w-full h-[60px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
                        <path d="M0,0 L0,60 C150,55 200,90 260,85 C310,80 330,40 370,55 C410,70 440,75 500,55 C580,30 680,60 700,50 C920,40 700,20 1200,35 L1200,0 Z" fill="#FFFFFF"></path>
                    </svg>
                </div>


                {/* Content */}
                <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
                    <h2 className="font-display text-4xl md:text-6xl font-black text-[#EAE3D2] mb-6 uppercase tracking-tight">
                        LEARN MORE ABOUT ZEWADI
                    </h2>

                    <p className="font-sans text-white text-base md:text-lg leading-relaxed max-w-2xl mb-12">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </p>

                    <button className="w-56 h-16 bg-[#EAE3D2] rounded-full shadow-xl hover:bg-[#D9D0BD] transition-transform hover:scale-105 cursor-pointer" aria-label="Learn More">
                        {/* Empty button as per design */}
                    </button>
                </div>

                {/* Bottom Wavy Edge (White overlay) */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                    <svg className="relative block w-full h-[60px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
                        <path d="M0,100 L0,60 C150,60 250,20 350,20 C450,20 500,80 600,80 C700,80 900,50 1200,50 L1200,100 Z" fill="#FFFFFF"></path>
                    </svg>
                </div>

            </div>
        </section>
    );
}

import Image from "next/image";

export default function Community() {
    return (
        <section className="relative w-full">

            {/* The Irregular Section */}
            <div className="relative w-full py-32 md:py-48">
                <Image
                    src="/home/section-3.webp"
                    alt="Learn More about Zewadi"
                    fill
                    className="object-cover"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40 z-0" />

                {/* Top Wavy Edge */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 -translate-y-[2px]">
                    <svg className="relative block w-full h-[60px] md:h-[120px] scale-110" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
                        <path d="M0,0 L0,60 C150,55 200,90 260,85 C310,80 330,40 370,55 C410,70 440,75 500,55 C580,30 680,60 700,50 C920,40 700,20 1200,35 L1200,0 Z" fill="#FFFFFF"></path>
                    </svg>
                </div>


                {/* Content */}
                <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
                    <h2 className="font-display text-4xl md:text-7xl font-black text-[#EAE3D2] mb-8 uppercase tracking-tight leading-tight max-w-4xl">
                        LEARN MORE ABOUT ZEWADI
                    </h2>

                    <p className="font-sans text-white text-base md:text-xl leading-relaxed max-w-3xl mb-12 drop-shadow-md">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </p>

                    <button className="px-14 py-4 bg-[#EAE3D2] hover:bg-white text-[#0A4834] font-sans font-bold rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg uppercase tracking-wider">
                        Explore More
                    </button>
                </div>

                {/* Bottom Wavy Edge */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
                    <svg className="relative block w-full h-[60px] md:h-[120px] scale-110" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100" preserveAspectRatio="none">
                        <path d="M0,100 L0,60 C150,60 250,20 350,20 C450,20 500,80 600,80 C700,80 900,50 1200,50 L1200,100 Z" fill="#FFFFFF"></path>
                    </svg>
                </div>

            </div>
        </section>
    );
}

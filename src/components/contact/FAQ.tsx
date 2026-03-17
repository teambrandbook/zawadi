import Image from "next/image";

export default function FAQ() {
    const faqs = [
        { id: 1, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 2, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 3, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 4, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 5, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 6, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
    ];

    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto flex flex-col items-center gap-16">

                {/* Header Block */}
                <div className="w-full bg-[#0A4834] rounded-[2.5rem] relative overflow-hidden h-[600px] md:h-[750px] flex flex-col items-center pt-20 md:pt-28 px-8">
                    <div className="text-center max-w-4xl z-10 flex flex-col gap-6">
                        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-[#EAE3D2] tracking-tight leading-none uppercase">
                            Quick Answers to Common Questions
                        </h2>
                        <p className="font-sans text-[#EAE3D2]/90 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
                            Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                        </p>
                    </div>

                    {/* Image Section */}
                    <div className="absolute bottom-10 left-10 w-[85%] md:w-[500px] h-[180px] md:h-[240px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
                        <Image src="/recipe/recipe-1.webp" alt="FAQ Preview" fill className="object-cover" />
                    </div>
                </div>

                {/* Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="relative group bg-[#9F8151] rounded-sm p-6 hover:bg-[#b09363] transition-colors cursor-pointer flex justify-between items-center shadow-sm">
                            <span className="font-sans font-bold text-white text-xs md:text-sm lg:text-base pr-4">
                                {faq.question}
                            </span>
                            <svg className="w-5 h-5 text-white transform group-hover:rotate-180 transition-transform shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

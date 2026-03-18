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
            <div className="max-w-[85rem] mx-auto flex flex-col items-center">

                {/* Header Section */}
                <div className="text-center max-w-4xl mb-16 flex flex-col gap-6">
                    <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-black text-[#0A4834] tracking-tight leading-none">
                        Quick Answers to Common Questions
                    </h2>
                    <p className="font-sans text-[#3A6B56] text-sm md:text-lg leading-relaxed max-w-3xl mx-auto">
                        Bridging the gap between technology and agriculture to redefine your food experience. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                    </p>
                </div>

                {/* FAQ Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {faqs.map((faq) => (
                        <div 
                            key={faq.id} 
                            className="bg-[#A6895A] rounded-sm p-6 md:p-8 flex justify-between items-center group cursor-pointer hover:bg-[#b09363] transition-all shadow-sm"
                        >
                            <span className="font-sans text-white text-xs md:text-sm lg:text-[15px] font-medium leading-normal pr-4">
                                {faq.question}
                            </span>
                            <div className="shrink-0 text-white/80 group-hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

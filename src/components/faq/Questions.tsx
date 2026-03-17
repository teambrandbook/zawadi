
export default function Questions() {
    // Placeholder data
    const faqs = [
        { id: 1, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 2, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 3, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 4, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 5, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 6, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
    ];

    return (
        <section className="w-full bg-white pb-24 pt-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {faqs.map((faq) => (
                    <div key={faq.id} className="relative group bg-[#9F8151] rounded-sm p-6 hover:bg-[#b09363] transition-colors cursor-pointer flex justify-between items-center shadow-sm">
                        <span className="font-sans font-bold text-white text-sm md:text-base pr-4">
                            {faq.question}
                        </span>
                        <svg className="w-5 h-5 text-white transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                        {/* No expanded state logic for now, just static as per request for "questions section" */}
                    </div>
                ))}
            </div>
        </section>
    );
}

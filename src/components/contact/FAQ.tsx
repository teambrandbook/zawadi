import Questions from "../faq/Questions";

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

                <Questions/>

            </div>
        </section>
    );
}

"use client";

import { useState } from "react";

export default function Questions() {
    const [activeId, setActiveId] = useState<number | null>(null);

    const faqs = [
        { id: 1, question: "What is Zewadi?", answer: "Zewadi is a wellness-focused food brand that creates premium, nutrient-dense products designed to support a balanced and vibrant lifestyle." },
        { id: 2, question: "Are your products healthy?", answer: "Yes, every product is crafted with wellness at its core, using natural, wholesome ingredients without compromise." },
        { id: 3, question: "Do you use additives or preservatives?", answer: "No, we emphasize purity. Our products are free from artificial additives, ensuring you get the most authentic and natural experience possible." },
        { id: 4, question: "How can I order?", answer: "Orders can be placed directly through our website or via our exclusive community retail partners." },
        { id: 5, question: "Do you offer international shipping?", answer: "Currently, we focused on domestic fulfillment to ensure maximum freshness, but we are expanding to international regions soon." },
        { id: 6, question: "What are your quality standards?", answer: "We follow world-class quality control measures, sourcing directly from ethical farms and maintaining rigorous transparency throughout our process." },
    ];

    const toggleFAQ = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section className="w-full bg-white pt-20 pb-10 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">                {faqs.map((faq) => {
                const isOpen = activeId === faq.id;

                return (
                    <div
                        key={faq.id}
                        onClick={() => toggleFAQ(faq.id)}
                        className="bg-[#9F8151] rounded-sm p-6 hover:bg-[#b09363] transition-colors cursor-pointer shadow-sm"
                    >
                        {/* Question Row */}
                        <div className="flex justify-between items-center">
                            <span className="font-mulish font-medium text-white text-sm md:text-base pr-4">
                                {faq.question}
                            </span>

                            <svg
                                className={`w-5 h-5 text-white transform transition-transform ${isOpen ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>

                        {/* Answer */}
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 mt-4" : "max-h-0"
                                }`}
                        >
                            <p className="text-white text-sm opacity-90">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                );
            })}
            </div>
        </section>
    );
}
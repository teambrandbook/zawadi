"use client";

import { useState } from "react";

export default function Questions() {
    const [activeId, setActiveId] = useState<number | null>(null);

    const faqs = [
        { id: 1, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 2, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 3, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 4, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 5, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 6, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
    ];

    const toggleFAQ = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section className="w-full bg-white pb-24 pt-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {faqs.map((faq) => {
                    const isOpen = activeId === faq.id;

                    return (
                        <div
                            key={faq.id}
                            onClick={() => toggleFAQ(faq.id)}
                            className="bg-[#9F8151] rounded-sm p-6 hover:bg-[#b09363] transition-colors cursor-pointer shadow-sm"
                        >
                            {/* Question Row */}
                            <div className="flex justify-between items-center">
                                <span className="font-sans font-bold text-white text-sm md:text-base pr-4">
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
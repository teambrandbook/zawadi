"use client";

import { useState } from "react";

export default function Questions() {
    const faqs = [
        { id: 1, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 2, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 3, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 4, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 5, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
        { id: 6, question: "Bridging the gap between technology and agriculture", answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint." },
    ];

    const [openId, setOpenId] = useState<number | null>(null);

    const toggleFaq = (id:number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="w-full bg-white pb-24 pt-24 px-6 md:px-12 lg:px-24 overflow-visible">
            <div className="max-w-[85rem] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 overflow-visible">
                {faqs.map((faq) => {
                    const isOpen = openId === faq.id;

                    return (
                        <div
                            key={faq.id}
                            className="relative overflow-visible"
                            style={{ zIndex: isOpen ? 50 : 1 }}
                        >
                            {/* Question Card */}
                            <div className="bg-[#9F8151] hover:bg-[#a88957] rounded-sm p-6 transition-colors cursor-pointer flex justify-between items-center shadow-sm">
                                <span className="font-sans font-bold text-white text-sm md:text-base pr-4">
                                    {faq.question}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => toggleFaq(faq.id)}
                                    className="shrink-0"
                                >
                                    <svg
                                        className={`w-5 h-5 text-white transition-transform duration-300 ${
                                            isOpen ? "rotate-180" : ""
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
                                </button>
                            </div>

                            {/* Answer Popup */}
                            <div
                                className={`absolute left-0 top-full mt-2 w-full rounded-sm bg-white shadow-xl transition-all duration-300 ${
                                    isOpen
                                        ? "opacity-100 visible translate-y-0"
                                        : "opacity-0 invisible -translate-y-2"
                                } z-50`}
                            >
                                <div className="p-6">
                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
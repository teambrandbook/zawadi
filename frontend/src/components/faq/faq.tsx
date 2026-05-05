"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import ContentSection from "../common/ContentSection";

type FaqItem = {
  question: string;
  answer?: string;
};

const leftFaqs: FaqItem[] = [
  {
    question: "What is Zewadi?",
    answer:
      "Zewadi is a premium food brand focused on simple, healthy, and meaningful living",
  },
  {
    question: "Do you use additives or preservatives?",
    answer:
      "We keep additives and preservatives as minimal as possible, focusing on quality and balanced ingredients.",
  },
  {
    question: "Do you offer delivery?",
    answer:
      "Yes, we offer delivery services to bring Zewadi products straight to your doorstep with convenience and care",
  },
  {
    question: "How can I order?",
    answer:
      "You can order directly through our website by browsing products, adding items to your cart, and completing checkout.",
  },
  {
    question: "What is the Zewadi Community?",
    answer:
      "The Zewadi Community is a group of people working toward healthier, better living together through simple daily choices.",
  },
];

const rightFaqs: FaqItem[] = [
  {
    question: "Are your products healthy?",
    answer:
      "Yes, our products are made with carefully selected, balanced ingredients to support healthier everyday living.",
  },
  {
    question: "What are the key benefits of Buckwheat?",
    answer:
      "Buckwheat is rich in fiber, protein, and nutrients, supports digestion and heart health, provides steady energy, and is naturally gluten-free.",
  },
  {
    question: "When will I receive my order?",
    answer:
      "You can expect your order delivery within the estimated time shown at checkout, depending on your location and product availability.",
  },
  {
    question: "How can Zewadi support a healthy lifestyle?",
    answer:
      "Zewadi supports a healthy lifestyle by offering quality food choices, encouraging balanced daily habits, and making wellness simple through small, meaningful everyday choices",
  },
  {
    question: "Does Zewadi deliver to other countries?",
    answer:
      "Yes, international delivery may be available depending on the country and product availability.",
  },
];

const faqRows = leftFaqs.map((leftFaq, index) => ({
  left: leftFaq,
  right: rightFaqs[index],
}));

function FaqCard({
  item,
  isOpen,
  onClick,
}: {
  item: FaqItem;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-full w-full rounded-[18px] border text-left shadow-[0_0_45px_rgba(0,0,0,0.04)] transition-colors ${
        isOpen ? "border-[#1f4d3a] bg-[#f1f5eb]" : "border-[#e3dbd8] bg-white"
      }`}
    >
      <div className="flex h-full items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-relaxed text-[#1f4d3a] sm:text-[16px]">
            {item.question}
          </h3>
          {isOpen && item.answer ? (
            <p className="mt-2.5 max-w-[450px] text-[13px] leading-6 text-[#727272]">
              {item.answer}
            </p>
          ) : null}
        </div>

        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isOpen ? "bg-[#1f4d3a] text-white" : "bg-[#f1f5eb] text-[#1f4d3a]"
          }`}
        >
          <ChevronRight
            size={15}
            className={`transition-transform ${isOpen ? "-rotate-90" : ""}`}
          />
        </span>
      </div>
    </button>
  );
}

export default function Faq() {
  const [openQuestion, setOpenQuestion] = useState(leftFaqs[0].question);

  return (
    <div className="bg-white">
      <ContentSection title="FAQ" subtitle="Frequently Asked Concerns" />

      <section className="mt-14 pb-12 pt-14 sm:mt-16 sm:pb-16 sm:pt-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto grid max-w-[1040px] gap-4">
            {faqRows.map((row) => (
              <div
                key={row.left.question}
                className="grid gap-4 lg:grid-cols-2 lg:items-stretch"
              >
                {[row.left, row.right].filter(Boolean).map((item) => (
                  <FaqCard
                    key={item.question}
                    item={item}
                    isOpen={openQuestion === item.question}
                    onClick={() =>
                      setOpenQuestion((current) =>
                        current === item.question ? "" : item.question
                      )
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

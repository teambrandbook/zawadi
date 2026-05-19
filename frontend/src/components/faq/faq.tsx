"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import ContentSection from "../common/ContentSection";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/locales/translations";

type FaqItem = {
  question: string;
  answer?: string;
};

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
      className={`w-full rounded-[18px] border text-left shadow-[0_0_45px_rgba(0,0,0,0.04)] transition-colors rtl:text-right ${
        isOpen ? "border-[#1f4d3a] bg-[#f1f5eb]" : "border-[#e3dbd8] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-4 rtl:flex-row-reverse sm:px-5 sm:py-5">
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
            className={`transition-transform ${isOpen ? "-rotate-90 rtl:rotate-90" : "rtl:rotate-180"}`}
          />
        </span>
      </div>
    </button>
  );
}

export default function Faq() {
  const { locale } = useLocale();
  const faqText = translations[locale]?.faqPage || translations.en.faqPage;
  const leftFaqs = faqText.leftFaqs;
  const rightFaqs = faqText.rightFaqs;
  const faqRows = leftFaqs.map((leftFaq, index) => ({
    left: leftFaq,
    right: rightFaqs[index],
  }));
  const [openQuestion, setOpenQuestion] = useState(leftFaqs[0].question);
  const allFaqs = faqRows.flatMap((row) => [row.left, row.right].filter(Boolean));

  useEffect(() => {
    setOpenQuestion(leftFaqs[0].question);
  }, [leftFaqs]);

  const renderFaqCard = (item: FaqItem) => (
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
  );

  return (
    <div className="bg-[#fffef5]">
      <ContentSection title={faqText.hero.title} subtitle={faqText.hero.subtitle} />

      <section className="mt-14 pb-12 pt-14 sm:mt-16 sm:pb-16 sm:pt-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-[1040px]">
            <div className="grid gap-4 lg:hidden">
              {allFaqs.map(renderFaqCard)}
            </div>

            <div className="hidden gap-4 lg:grid lg:grid-cols-2 lg:items-start">
              <div className="grid gap-4">{leftFaqs.map(renderFaqCard)}</div>
              <div className="grid gap-4">{rightFaqs.map(renderFaqCard)}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

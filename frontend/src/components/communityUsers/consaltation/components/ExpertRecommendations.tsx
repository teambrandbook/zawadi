"use client";

import { Lightbulb } from "lucide-react";

type Recommendation = {
  id: string;
  text: string;
  author: string;
};

export default function ExpertRecommendations({ items }: { items: Recommendation[] }) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h3 className="text-lg font-semibold text-[#0A4833]">Expert Recommendations</h3>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-md bg-[#F8F3E9] p-3">
            <p className="text-xs text-[#4B5563]">&ldquo;{item.text}&rdquo;</p>
            <p className="mt-1 text-[11px] text-[#8B6A3A]">- {item.author}</p>
          </article>
        ))}
      </div>

      <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#6B7280]">
        <Lightbulb className="h-3.5 w-3.5 text-[#A88751]" />
        Updated by your consultation team.
      </div>
    </section>
  );
}

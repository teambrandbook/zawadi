import type { AnalyticsCard } from "../types";

type AnalyticsCardsGridProps = {
  cards: AnalyticsCard[];
};

export default function AnalyticsCardsGrid({ cards }: AnalyticsCardsGridProps) {
  const toneClassMap = {
    default: "text-[#1F2937]",
    green: "text-[#0A7A44]",
    orange: "text-[#C76A12]",
    blue: "text-[#2E73D2]",
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {cards.map((card) => (
        <article key={card.id} className="rounded-lg border border-[#E5E7EB] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#0A4B34]">{card.title}</h3>
          <div className="mt-3 space-y-2">
            {card.rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280]">{row.label}</span>
                <span className={`font-medium ${toneClassMap[row.tone ?? "default"]}`}>{row.value}</span>
              </div>
            ))}

            {card.progress ? (
              <div className="pt-1">
                <div className="mb-1 h-1.5 rounded-full bg-[#ECE7DA]">
                  <div
                    className={`h-1.5 rounded-full ${
                      card.progress.tone === "gold" ? "bg-[#9C7A4D]" : "bg-[#0A4B34]"
                    }`}
                    style={{ width: `${card.progress.value}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

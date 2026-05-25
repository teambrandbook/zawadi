import { availabilitySummary } from "./updateAvailabilityData";

export default function AvailabilitySummaryCard() {
  return (
    <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-4">
      <h2 className="text-sm font-semibold text-[#0A4833]">Current Availability Summary</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {availabilitySummary.map((item) => (
          <article key={item.label} className="rounded-[8px] bg-[#F1E8D7] px-4 py-3">
            <p className="text-[11px] text-[#8A8F98]">{item.label}</p>
            <p className={`mt-2 text-sm font-semibold ${item.accent}`}>{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

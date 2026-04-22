import { quickAvailability } from "./appointmentsData";

export default function QuickAvailabilityCard() {
  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.04)]">
      <h2 className="text-base font-semibold text-[#0A4833]">Quick Availability</h2>

      <div className="mt-5 space-y-3">
        {quickAvailability.map((item) => (
          <div key={item.day} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[#667085]">{item.day}</span>
            <span className="font-medium text-[#0A4833]">{item.time}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 h-10 w-full rounded-[10px] border border-[#A7C4B8] bg-white text-sm font-medium text-[#0A4833] transition hover:bg-[#F6FBF8]"
      >
        Update Schedule
      </button>
    </section>
  );
}

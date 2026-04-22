import { recentActivities } from "./appointmentsData";

export default function RecentActivityCard() {
  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.04)]">
      <h2 className="text-base font-semibold text-[#0A4833]">Recent Activity</h2>

      <div className="mt-5 space-y-4">
        {recentActivities.map((item) => (
          <article key={item.title} className="flex items-start gap-3">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.dot}`} />
            <div>
              <p className="text-sm leading-6 text-[#344054]">{item.title}</p>
              <p className="text-xs text-[#98A2B3]">{item.time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

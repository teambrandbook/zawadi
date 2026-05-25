import { appointmentStats, type AppointmentStat } from "./appointmentsData";

type Props = {
  stats?: AppointmentStat[];
};

export default function AppointmentsStatsGrid({ stats = appointmentStats }: Props) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.title}
            className="rounded-[14px] border border-[#E4E7EC] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(16,24,40,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-[30px] font-semibold leading-none ${item.tone}`}>{item.value}</p>
                <p className="mt-3 max-w-[120px] text-xs leading-5 text-[#667085]">{item.title}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F6F7F8]">
                <Icon className={`h-4 w-4 ${item.tone}`} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

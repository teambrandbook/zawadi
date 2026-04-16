import { summaryCards } from "../userManagementShared";

export default function UserStatsGrid() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {summaryCards.map(({ label, value, change, hint, Icon, iconBg, iconColor, changeColor }) => (
        <article key={label} className="rounded-xl border border-[#DFDFDF] bg-white p-4">
          <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <p className="text-[38px] font-semibold leading-none text-[#0A4833]">{value}</p>
          <p className="mt-1 text-base text-[#4B5563]">{label}</p>
          <p className="mt-1 text-sm">
            <span className={changeColor}>{change}</span>
            <span className="text-[#6B7280]"> {hint}</span>
          </p>
        </article>
      ))}
    </section>
  );
}


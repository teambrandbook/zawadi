import { NotificationsPageData } from "./types";

type Props = {
  tabs: NotificationsPageData["tabs"];
};

export default function NotificationTabs({ tabs }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
              tab.active
                ? "bg-[#0A4833] text-white"
                : "text-[#374151] hover:bg-[#F7F3EC]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}

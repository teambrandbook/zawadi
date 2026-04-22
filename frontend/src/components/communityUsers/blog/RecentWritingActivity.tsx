import { activityStatusMeta } from "./blogStatusMeta";
import type { WritingActivity } from "./blogTypes";

type Props = {
  recentActivity: WritingActivity[];
};

export default function RecentWritingActivity({ recentActivity }: Props) {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <h2 className="text-base font-bold text-[#06402B]">Recent Writing Activity</h2>
      <div className="mt-4 divide-y divide-[#E5E7EB]">
        {recentActivity.map((activity) => {
          const activityMeta = activityStatusMeta[activity.status];
          const Icon = activityMeta.Icon;
          return (
            <article key={activity.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${activityMeta.wrap}`}>
                  <Icon className={`h-4 w-4 ${activityMeta.color}`} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#06402B]">{activity.title}</p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">{activity.note}</p>
                </div>
              </div>
              <span className="text-lg text-[#06402B]">-&gt;</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

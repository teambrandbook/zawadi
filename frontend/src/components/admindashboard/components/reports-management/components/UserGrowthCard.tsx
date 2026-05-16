import type { Point } from "../types";

type UserGrowthCardProps = {
  data: Point[];
};

export default function UserGrowthCard({ data }: UserGrowthCardProps) {
  const max = Math.max(1, ...data.map((item) => item.value));
  const barHeight = (value: number) => {
    if (value <= 0) return 0;
    return Math.max(6, (value / max) * 204);
  };

  return (
    <article className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-6">
      <h2 className="mb-7 text-base font-semibold text-[#0A4B34]">User Growth</h2>
      <div className="flex h-[260px] items-end gap-3 rounded-md bg-[#F4EEDB]/65 px-5 pb-[34px] pt-[22px]">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.label}
              className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2"
              title={`${item.value.toLocaleString()} users`}
            >
              <span className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 rounded-md bg-[#0A4B34] px-2 py-1 text-[11px] font-medium text-white shadow-sm group-hover:block">
                {item.value.toLocaleString()} users
              </span>
              <div
                className="w-full rounded-t-sm bg-[#9B7E4A]"
                style={{ height: `${barHeight(item.value)}px` }}
              />
              <span className="text-[11px] text-[#6B7280]">{item.label}</span>
            </div>
          ))
        ) : (
          <div className="flex h-full flex-1 items-center justify-center self-stretch text-sm text-[#6B7280]">
            No user growth data yet.
          </div>
        )}
      </div>
    </article>
  );
}

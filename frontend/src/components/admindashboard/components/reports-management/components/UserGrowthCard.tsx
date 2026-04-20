import type { Point } from "../types";

type UserGrowthCardProps = {
  data: Point[];
};

export default function UserGrowthCard({ data }: UserGrowthCardProps) {
  const max = 400;

  return (
    <article className="rounded-lg border border-[#E5E7EB] bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-[#0A4B34]">User Growth</h2>
      <div className="flex h-[210px] items-end gap-3 rounded-md bg-[#F4EEDB]/65 px-4 pb-4 pt-6">
        {data.map((item) => (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-sm bg-[#9B7E4A]"
              style={{ height: `${(item.value / max) * 165}px` }}
            />
            <span className="text-[11px] text-[#6B7280]">{item.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

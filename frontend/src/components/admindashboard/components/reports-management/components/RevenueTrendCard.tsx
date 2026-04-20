import type { Point } from "../types";

type RevenueTrendCardProps = {
  data: Point[];
};

export default function RevenueTrendCard({ data }: RevenueTrendCardProps) {
  const width = 460;
  const height = 230;
  const padX = 20;
  const padY = 16;
  const min = 0;
  const max = 30;
  const points = data
    .map((item, index) => {
      const x = padX + (index * (width - padX * 2)) / (data.length - 1);
      const y = height - padY - ((item.value - min) / (max - min)) * (height - padY * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `${padX},${height - padY} ${points} ${width - padX},${height - padY}`;

  return (
    <article className="rounded-lg border border-[#E5E7EB] bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-[#0A4B34]">Revenue Trend</h2>
      <div>
        <div className="relative h-[210px] rounded-md bg-[#F4EEDB]/65">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
            <polygon points={areaPoints} fill="#D9CCAE" opacity="0.45" />
            <polyline points={points} fill="none" stroke="#0A4B34" strokeWidth="3" />
          </svg>
        </div>
        <div className="mt-2 grid grid-cols-6 text-center text-[11px] text-[#6B7280]">
          {data.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

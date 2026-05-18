import type { Point } from "../types";

type RevenueTrendCardProps = {
  data: Point[];
};

export default function RevenueTrendCard({ data }: RevenueTrendCardProps) {
  const width = 460;
  const height = 260;
  const padLeft = 52;
  const padRight = 0;
  const padTop = 22;
  const padBottom = 34;
  const min = 0;
  const max = Math.max(1, ...data.map((item) => item.value));
  const axisMax = Math.ceil(max / 5) * 5;
  const yTicks = Array.from({ length: 6 }, (_, index) => (axisMax / 5) * index);
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;
  const valueToY = (value: number) => {
    const rawY = padTop + chartHeight - ((value - min) / (axisMax - min)) * chartHeight;
    if (value > 0) return Math.min(rawY, height - padBottom - 6);
    return rawY;
  };
  const singlePointY =
    data.length === 1
      ? valueToY(data[0].value)
      : null;
  const points = data
    .map((item, index) => {
      const x = data.length === 1 ? padLeft + chartWidth / 2 : padLeft + (index * chartWidth) / (data.length - 1);
      const y = singlePointY ?? valueToY(item.value);
      return `${x},${y}`;
    })
    .join(" ");
  const linePoints = data.length === 1 && singlePointY !== null ? `${padLeft},${singlePointY} ${width - padRight},${singlePointY}` : points;
  const areaPoints =
    data.length === 1 && singlePointY !== null
      ? `${padLeft},${height - padBottom} ${padLeft},${singlePointY} ${width - padRight},${singlePointY} ${width - padRight},${height - padBottom}`
      : data.length > 0
        ? `${padLeft},${height - padBottom} ${points} ${width - padRight},${height - padBottom}`
        : "";
  const formatTick = (value: number) => {
    if (value === 0) return "0";
    if (value >= 1000) return `${Number((value / 1000).toFixed(1)).toLocaleString()}k`;
    return value.toLocaleString();
  };

  return (
    <article className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-6">
      <h2 className="mb-7 text-base font-semibold text-[#0A4B34]">Revenue Trend</h2>
      <div>
        <div className="relative h-[260px]">
          {data.length > 0 ? (
            <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
              <rect x={padLeft} y={padTop} width={chartWidth} height={chartHeight} fill="#E8DDC9" opacity="0.78" />
              {yTicks.map((tick) => {
                const y = padTop + chartHeight - (tick / axisMax) * chartHeight;
                return (
                  <g key={tick}>
                    <line x1={padLeft} x2={width - padRight} y1={y} y2={y} stroke="#D8D6CA" strokeWidth="1" />
                    <text x={padLeft - 6} y={y + 4} textAnchor="end" className="fill-[#4B5563] text-[11px]">
                      {formatTick(tick)}
                    </text>
                  </g>
                );
              })}
              {data.map((item, index) => {
                const x = data.length === 1 ? padLeft + chartWidth / 2 : padLeft + (index * chartWidth) / (data.length - 1);
                return <line key={item.label} x1={x} x2={x} y1={padTop} y2={height - padBottom} stroke="#D8D6CA" strokeWidth="1" />;
              })}
              <line x1={padLeft} x2={width - padRight} y1={height - padBottom} y2={height - padBottom} stroke="#6B7280" strokeWidth="1" />
              <polygon points={areaPoints} fill="#C8C4A8" opacity="0.48" />
              <polyline points={linePoints} fill="none" stroke="#064E3B" strokeWidth="3" strokeLinejoin="round" />
              {data.map((item, index) => {
                const x = data.length === 1 ? padLeft + chartWidth / 2 : padLeft + (index * chartWidth) / (data.length - 1);
                const y = singlePointY ?? valueToY(item.value);
                return <circle key={`${item.label}-point`} cx={x} cy={y} r="3" fill="#064E3B" />;
              })}
              {data.map((item, index) => {
                const x = data.length === 1 ? padLeft + chartWidth / 2 : padLeft + (index * chartWidth) / (data.length - 1);
                return (
                  <text key={`${item.label}-label`} x={x} y={height - 15} textAnchor="middle" className="fill-[#4B5563] text-[12px]">
                    {item.label}
                  </text>
                );
              })}
            </svg>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#6B7280]">No revenue data yet.</div>
          )}
        </div>
      </div>
    </article>
  );
}

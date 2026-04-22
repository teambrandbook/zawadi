import { CircleUserRound } from "lucide-react";
import type { ProfileDetailItem } from "./profileTypes";

type Props = {
  details: ProfileDetailItem[];
};

export default function BasicDetailsCard({ details }: Props) {
  return (
    <section className="rounded-[12px] border border-[#E7E5E4] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
      <div className="flex items-center gap-2 text-[#0A4833]">
        <CircleUserRound className="h-4 w-4 text-[#A38355]" />
        <h2 className="text-lg font-semibold tracking-[-0.5px]">Basic Details</h2>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {details.map((item) => (
          <article key={item.label}>
            <p className="text-xs font-medium text-[#4B5563]">{item.label}</p>
            <div className="mt-2 rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 py-3 text-[15px] text-[#111827]">
              {item.value}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

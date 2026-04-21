import { Clock } from "lucide-react";

export default function PublicationStatusCard() {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <h2 className="text-lg font-bold text-[#06402B]">Publication Status</h2>
      <div className="mt-4 rounded-lg bg-[#F8F3E9] p-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#FEF3C7] text-[#A88751]">
            <Clock className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#06402B]">Draft Status</p>
            <p className="mt-1 text-xs text-[#6B7280]">Your blog will go through admin review before being published to the community.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

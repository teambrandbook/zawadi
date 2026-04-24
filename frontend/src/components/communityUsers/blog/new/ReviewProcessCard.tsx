import { ShieldCheck } from "lucide-react";

export default function ReviewProcessCard() {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#E8F2ED] text-[#06402B]">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-[#06402B]">Review Process</h2>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            Your blog will go through admin review before being published to the community.
          </p>
        </div>
      </div>
    </section>
  );
}

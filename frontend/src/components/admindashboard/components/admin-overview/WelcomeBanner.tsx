"use client";

export default function WelcomeBanner() {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-[#0A4833]">Welcome back, Sarah!</h2>
          <p className="text-sm text-[#6B7280]">Here&apos;s what&apos;s happening with ZEWADI wellness community today</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#9CA3AF]">Platform Status</p>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-[#15803D]">
            <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
            All Systems Operational
          </p>
        </div>
      </div>
    </section>
  );
}

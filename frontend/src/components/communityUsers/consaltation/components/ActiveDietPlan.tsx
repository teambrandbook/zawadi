"use client";

type Props = {
  progress: number;
  onViewPlan: () => void;
};

export default function ActiveDietPlan({ progress, onViewPlan }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h3 className="text-lg font-semibold text-[#0A4833]">Active Diet Plan</h3>
      <h4 className="mt-3 text-sm font-semibold text-[#0A4833]">Buckwheat Wellness Plan</h4>
      <p className="mt-1 text-xs text-[#6B7280]">
        A 30-day nutrition program focused on buckwheat integration for optimal health.
      </p>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs text-[#6B7280]">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#E5E7EB]">
          <div className="h-2 rounded-full bg-[#A88751]" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-3 space-y-1 text-xs text-[#374151]">
        <p className="flex items-center justify-between">
          <span>Target Weight</span>
          <span>65 kg</span>
        </p>
        <p className="flex items-center justify-between">
          <span>Daily Calories</span>
          <span>1,800 kcal</span>
        </p>
      </div>

      <button
        onClick={onViewPlan}
        className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-md bg-[#A88751] text-xs font-medium text-white hover:bg-[#8E7346]"
      >
        View Full Plan
      </button>
    </section>
  );
}

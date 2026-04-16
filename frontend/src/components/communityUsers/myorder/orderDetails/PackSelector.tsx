"use client";

import { PackOption } from "./types";

type Props = {
  packs: PackOption[];
  selectedPackId: string;
  onSelectPack: (packId: string) => void;
};

export default function PackSelector({ packs, selectedPackId, onSelectPack }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <h3 className="text-xl font-semibold text-[#0A4833]">Select Your Pack</h3>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {packs.map((pack) => {
          const selected = selectedPackId === pack.id;
          return (
            <button
              key={pack.id}
              onClick={() => onSelectPack(pack.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                selected ? "border-[#0A4833] bg-[#F6F7F3]" : "border-[#DFDFDF] bg-white hover:bg-[#FAFAFA]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#0A4833]">{pack.name}</p>
                {pack.badge && (
                  <span className="rounded-full bg-[#F1E3C4] px-2 py-1 text-[10px] font-semibold text-[#8C6A37]">
                    {pack.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-3xl font-bold leading-none text-[#0A4833]">₹{pack.price}</p>
              <p className="mt-1 text-xs text-[#9F8151]">{pack.unitNote}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

"use client";

type Props = {
  quantity: number;
  max: number;
  onQuantityChange: (value: number) => void;
};

export default function QuantitySelector({ quantity, max, onQuantityChange }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <h3 className="text-xl font-semibold text-[#0A4833]">Quantity</h3>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#A88751] text-white"
        >
          -
        </button>
        <span className="inline-flex h-8 min-w-10 items-center justify-center rounded-md border border-[#D8D8D8] bg-white px-3 font-semibold text-[#0A4833]">
          {quantity}
        </span>
        <button
          onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#A88751] text-white"
        >
          +
        </button>
        <p className="text-xs text-[#6B7280]">{max} stock available</p>
      </div>
    </section>
  );
}

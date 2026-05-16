"use client";

type Props = {
  quantity: number;
  max: number;
  onQuantityChange: (value: number) => void;
};

const LOW_STOCK_THRESHOLD = 5;

export default function QuantitySelector({ quantity, max, onQuantityChange }: Props) {
  const isOutOfStock = max <= 0;
  const showStockText = max <= LOW_STOCK_THRESHOLD;

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-[#0A4833]">Quantity</h3>
        {showStockText && (
          <p
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
              isOutOfStock
                ? "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
                : "border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C]"
            }`}
          >
            {isOutOfStock ? "Out of stock" : `Only ${max} left`}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          disabled={isOutOfStock || quantity <= 1}
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#A88751] text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          -
        </button>
        <span className="inline-flex h-8 min-w-10 items-center justify-center rounded-md border border-[#D8D8D8] bg-white px-3 font-semibold text-[#0A4833]">
          {quantity}
        </span>
        <button
          type="button"
          disabled={isOutOfStock || quantity >= max}
          onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#A88751] text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          +
        </button>
      </div>
    </section>
  );
}

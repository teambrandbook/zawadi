"use client";

export default function RecipeFilter({
  categories,
  activeCategory,
  onChange,
}: {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {categories.map((category: string) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-5 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.06em] transition ${
              isActive
                ? "border-[#0e2207] bg-[#b47800] text-white"
                : "border-[#0e2207] bg-[#f3f3ed] text-[#0e2207]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

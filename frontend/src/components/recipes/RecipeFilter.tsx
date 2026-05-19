"use client";

export default function RecipeFilter({
  categories,
  activeCategory,
  onChange,
  labels,
}: {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  labels: Record<string, string>;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-4">
      {categories.map((category: string) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-5 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.06em] transition-all duration-300
              ${
                isActive
                  ? "border-[#0e2207] bg-[#b47800] text-white shadow-md"
                  : "border-[#0e2207] bg-[#f3f3ed] text-[#0e2207] hover:bg-[#e8e8df]"
              }`}
          >
            {labels[category] || category}
          </button>
        );
      })}
    </div>
  );
}

import { Download, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";


type NutritionistsHeaderProps = {
  canCreateNutritionists: boolean;
  canExportNutritionists: boolean;
};

export default function NutritionistsHeader({ canCreateNutritionists, canExportNutritionists }: NutritionistsHeaderProps) {
  const router = useRouter();
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="shrink-0 text-2xl font-semibold text-[#0A4833] md:text-[28px]">Nutritionists</h1>

        <div className="relative min-w-0 flex-1 md:w-[230px] md:flex-none">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8CA39A]" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-md border border-[#D9D9D9] bg-[#F2EFE8] pl-9 pr-3 text-sm text-[#0A4833] outline-none placeholder:text-[#8CA39A]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 md:w-auto">
        {canExportNutritionists && (
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-[#D9D9D9] bg-white px-3 text-sm font-medium text-[#0A4833]">
            <Download size={14} />
            Export
          </button>
        )}

        {canCreateNutritionists && (
          <button
          onClick={() => router.push("/admindashboard/nutritionist/addnutritonist")}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#0A4833] px-4 text-sm font-medium text-white">
            <Plus size={16} />
            Add Nutritionist
          </button>
        )}
      </div>
    </header>
  );
}

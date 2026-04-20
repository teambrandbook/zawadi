import { Download, Funnel, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";


export default function NutritionistsHeader() {
  const router = useRouter();
  return (
    <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="text-4xl font-semibold text-[#0A4833]">Nutritionists</h1>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative  min-w-[220px] max-w-[230px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8CA39A]" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-md border border-[#D9D9D9] bg-[#F2EFE8] pl-9 pr-3 text-sm text-[#0A4833] outline-none placeholder:text-[#8CA39A]"
          />
        </div>

        <button className="inline-flex h-10 items-center gap-2 rounded-md border border-[#D9D9D9] bg-white px-3 text-sm font-medium text-[#0A4833]">
          <Funnel size={14} />
          Filter
        </button>

        <button className="inline-flex h-10 items-center gap-2 rounded-md border border-[#D9D9D9] bg-white px-3 text-sm font-medium text-[#0A4833]">
          <Download size={14} />
          Export
        </button>

        <button 
        onClick={() => router.push("/admindashboard/nutritionist/addnutritonist")}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-[#0A4833] px-4 text-sm font-medium text-white">
          <Plus size={16} />
          Add Nutritionist
        </button>
      </div>
    </header>
  );
}

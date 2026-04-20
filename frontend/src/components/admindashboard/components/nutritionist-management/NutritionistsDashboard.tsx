"use client";

import NutritionistFiltersCard from "./components/NutritionistFiltersCard";
import NutritionistStatsGrid from "./components/NutritionistStatsGrid";
import NutritionistsDataTable from "./components/NutritionistsDataTable";
import NutritionistsHeader from "./components/NutritionistsHeader";
import { nutritionistMockData } from "./nutritionistMockData";
import type { DeepPartial, NutritionistPageData } from "./nutritionistTypes";

type NutritionistsDashboardProps = {
  data?: DeepPartial<NutritionistPageData>;
};

function mergeNutritionistData(data?: DeepPartial<NutritionistPageData>): NutritionistPageData {
  if (!data) {
    return nutritionistMockData;
  }

  return {
    ...nutritionistMockData,
    ...data,
    stats: data.stats ?? nutritionistMockData.stats,
    rows: data.rows ?? nutritionistMockData.rows,
  };
}

export default function NutritionistsDashboard({ data }: NutritionistsDashboardProps) {
  const pageData = mergeNutritionistData(data);

  return (
    <section className="w-full bg-[#F7F8FA] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <NutritionistsHeader />
        <NutritionistStatsGrid items={pageData.stats} />
        <NutritionistFiltersCard />
        <NutritionistsDataTable rows={pageData.rows} />
      </div>
    </section>
  );
}

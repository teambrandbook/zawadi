import AnalyticsCardsGrid from "./components/AnalyticsCardsGrid";
import DetailedReportsTable from "./components/DetailedReportsTable";
import ReportsFiltersBar from "./components/ReportsFiltersBar";
import ReportsHeader from "./components/ReportsHeader";
import ReportsKpiGrid from "./components/ReportsKpiGrid";
import RevenueTrendCard from "./components/RevenueTrendCard";
import UserGrowthCard from "./components/UserGrowthCard";
import {
  analyticsCards,
  filterOptions,
  kpiCards,
  reportRows,
  revenueTrendData,
  userGrowthData,
} from "./reportsMockData";

export default function ReportsAnalyticsPage() {
  return (
    <section className="w-full bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <ReportsHeader />
        <ReportsFiltersBar filters={filterOptions} />
        <ReportsKpiGrid cards={kpiCards} />

        <div className="grid gap-3 xl:grid-cols-2">
          <RevenueTrendCard data={revenueTrendData} />
          <UserGrowthCard data={userGrowthData} />
        </div>

        <AnalyticsCardsGrid cards={analyticsCards} />
        <DetailedReportsTable rows={reportRows} />
      </div>
    </section>
  );
}

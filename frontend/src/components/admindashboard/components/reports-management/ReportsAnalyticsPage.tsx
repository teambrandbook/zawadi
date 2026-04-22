"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
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
  kpiCards as defaultKpiCards,
  reportRows,
  revenueTrendData,
  userGrowthData,
} from "./reportsMockData";
import type { KpiCard } from "./types";

type StatsData = {
  total_users?: number;
  total_orders?: number;
  total_products?: number;
  total_events?: number;
  total_consultations?: number;
  total_revenue?: number;
};

function buildKpiCards(stats: StatsData): KpiCard[] {
  return [
    {
      id: "revenue",
      label: "Total Revenue",
      value: stats.total_revenue != null ? `$${Number(stats.total_revenue).toLocaleString()}` : defaultKpiCards[0].value,
      change: "+12.5%",
      icon: "revenue",
    },
    {
      id: "orders",
      label: "Total Orders",
      value: stats.total_orders != null ? String(stats.total_orders) : defaultKpiCards[1].value,
      change: "+8.2%",
      icon: "orders",
    },
    {
      id: "users",
      label: "Active Users",
      value: stats.total_users != null ? String(stats.total_users) : defaultKpiCards[2].value,
      change: "+15.3%",
      icon: "users",
    },
    {
      id: "bookings",
      label: "Consultation Bookings",
      value: stats.total_consultations != null ? String(stats.total_consultations) : defaultKpiCards[3].value,
      change: "+22.1%",
      icon: "bookings",
    },
  ];
}

export default function ReportsAnalyticsPage() {
  const [stats, setStats] = useState<StatsData>({});
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/supperadmin/stats/");
        setStats(res.data ?? {});
      } catch {
        setStatsError(true);
      }
    };
    fetchStats();
  }, []);

  const kpiCards = useMemo(() => buildKpiCards(stats), [stats]);

  return (
    <section className="w-full bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <ReportsHeader />
        <ReportsFiltersBar filters={filterOptions} />

        {statsError && (
          <div className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
            Could not load live stats — showing cached values.
          </div>
        )}

        <ReportsKpiGrid cards={kpiCards} />

        <div className="grid gap-3 xl:grid-cols-2">
          {/* TODO: needs dedicated time-series analytics endpoint for chart data */}
          <RevenueTrendCard data={revenueTrendData} />
          <UserGrowthCard data={userGrowthData} />
        </div>

        <AnalyticsCardsGrid cards={analyticsCards} />
        {/* TODO: needs dedicated reports endpoint for tabular report rows */}
        <DetailedReportsTable rows={reportRows} />
      </div>
    </section>
  );
}

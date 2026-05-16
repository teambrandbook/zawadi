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
import { filterOptions, kpiCards as defaultKpiCards } from "./reportsMockData";
import type { AnalyticsCard, KpiCard, Point, ReportRow } from "./types";

type StatsData = {
  total_users?: number;
  total_orders?: number;
  total_products?: number;
  total_events?: number;
  total_consultations?: number;
  total_revenue?: number;
};

type ReportsData = {
  revenue_trend: Point[];
  user_growth: Point[];
  analytics: {
    consultations: { total: number; completed: number; cancelled: number; completion_rate: number };
    events: { total: number; registrations: number; avg_per_event: number };
    content: { recipes: number; blogs: number; approval_rate: number; recipes_published_pct: number };
  };
  report_rows: ReportRow[];
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

function buildAnalyticsCards(reports: ReportsData): AnalyticsCard[] {
  const { consultations, events, content } = reports.analytics;
  return [
    {
      id: "consultation",
      title: "Consultation Analytics",
      rows: [
        { label: "Total Consultations", value: String(consultations.total) },
        { label: "Completed", value: String(consultations.completed), tone: "green" },
        { label: "Cancelled", value: String(consultations.cancelled), tone: "orange" },
        { label: "Completion Rate", value: `${consultations.completion_rate}%` },
      ],
    },
    {
      id: "events",
      title: "Events Analytics",
      rows: [
        { label: "Total Events", value: String(events.total) },
        { label: "Registrations", value: String(events.registrations), tone: "blue" },
        { label: "Avg. per Event", value: String(events.avg_per_event) },
      ],
    },
    {
      id: "content",
      title: "Content Analytics",
      rows: [
        { label: "Recipes", value: String(content.recipes) },
        { label: "Blogs", value: String(content.blogs) },
        { label: "Approval Rate", value: `${content.approval_rate}%`, tone: "green" },
      ],
      progress: { label: "Recipes Published", value: content.recipes_published_pct, tone: "green" },
    },
  ];
}

export default function ReportsAnalyticsPage() {
  const [stats, setStats] = useState<StatsData>({});
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          api.get("/superadmin/stats/"),
          api.get("/superadmin/reports/"),
        ]);
        setStats(statsRes.data ?? {});
        setReports(reportsRes.data ?? null);
      } catch {
        setStatsError(true);
      }
    };
    fetchAll();
  }, []);

  const kpiCards = useMemo(() => buildKpiCards(stats), [stats]);
  const analyticsCards = useMemo(
    () => (reports ? buildAnalyticsCards(reports) : []),
    [reports]
  );
  const revenueTrendData: Point[] = reports?.revenue_trend ?? [];
  const userGrowthData: Point[] = reports?.user_growth ?? [];
  const reportRows: ReportRow[] = reports?.report_rows ?? [];

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
          <RevenueTrendCard data={revenueTrendData} />
          <UserGrowthCard data={userGrowthData} />
        </div>

        <AnalyticsCardsGrid cards={analyticsCards} />
        <DetailedReportsTable rows={reportRows} />
      </div>
    </section>
  );
}

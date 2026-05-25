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
import { filterOptions } from "./reportsMockData";
import type { AnalyticsCard, KpiCard, Point, ReportPeriod, ReportRow } from "./types";

type StatsData = {
  total_users?: number;
  total_orders?: number;
  total_products?: number;
  total_events?: number;
  total_consultations?: number;
  total_revenue?: number;
};

type ReportsData = {
  stats?: StatsData;
  revenue_trend: Point[];
  user_growth: Point[];
  analytics: {
    consultations: { total: number; completed: number; cancelled: number; completion_rate: number };
    events: { total: number; registrations: number; avg_per_event: number };
    content: { recipes: number; blogs: number; approval_rate: number; recipes_published_pct: number };
  };
  report_rows: ReportRow[];
};

type ApiReportRow = {
  id?: string;
  report_type?: string;
  reportType?: string;
  date_range?: string;
  dateRange?: string;
  records?: string | number;
  total?: string | number;
  status?: string;
  updated_at?: string;
  updatedAt?: string;
};

type ApiReportsData = Omit<ReportsData, "report_rows"> & {
  report_rows?: ApiReportRow[];
};

function formatNumber(value: unknown): string {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number.toLocaleString() : "0";
}

function formatCurrency(value: unknown): string {
  const number = Number(value ?? 0);
  return Number.isFinite(number)
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(number)
    : "INR 0";
}

function buildKpiCards(stats: StatsData): KpiCard[] {
  return [
    {
      id: "revenue",
      label: "Total Revenue",
      value: formatCurrency(stats.total_revenue),
      change: "Live",
      icon: "revenue",
    },
    {
      id: "orders",
      label: "Total Orders",
      value: formatNumber(stats.total_orders),
      change: "Live",
      icon: "orders",
    },
    {
      id: "users",
      label: "Active Users",
      value: formatNumber(stats.total_users),
      change: "Live",
      icon: "users",
    },
    {
      id: "bookings",
      label: "Consultation Bookings",
      value: formatNumber(stats.total_consultations),
      change: "Live",
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

function mapReportRows(rows: ApiReportRow[] = []): ReportRow[] {
  return rows.map((row, index) => ({
    id: String(row.id ?? `report-${index + 1}`),
    reportType: String(row.reportType ?? row.report_type ?? "Report"),
    dateRange: String(row.dateRange ?? row.date_range ?? "All Time"),
    records: formatNumber(row.records),
    total: Number(row.total ?? 0),
    status: row.status === "Processing" ? "Processing" : "Ready",
    updatedAt: String(row.updatedAt ?? row.updated_at ?? "Just now"),
  }));
}

function normalizeReports(data: ApiReportsData | null | undefined): ReportsData | null {
  if (!data) return null;
  return {
    stats: data.stats ?? {},
    revenue_trend: Array.isArray(data.revenue_trend) ? data.revenue_trend : [],
    user_growth: Array.isArray(data.user_growth) ? data.user_growth : [],
    analytics: data.analytics ?? {
      consultations: { total: 0, completed: 0, cancelled: 0, completion_rate: 0 },
      events: { total: 0, registrations: 0, avg_per_event: 0 },
      content: { recipes: 0, blogs: 0, approval_rate: 0, recipes_published_pct: 0 },
    },
    report_rows: mapReportRows(data.report_rows),
  };
}

function buildParams(period: ReportPeriod, startDate: string, endDate: string) {
  const params: Record<string, string> = { period };
  if (period === "custom") {
    params.start_date = startDate;
    params.end_date = endDate;
  }
  return params;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

function getFilename(contentDisposition: string | undefined, fallback: string) {
  const match = contentDisposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? fallback;
}

export default function ReportsAnalyticsPage() {
  const [stats, setStats] = useState<StatsData>({});
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [statsError, setStatsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<ReportPeriod>("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportingReportId, setExportingReportId] = useState<string | null>(null);
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      if (period === "custom" && (!startDate || !endDate)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setStatsError(false);
      try {
        const reportsRes = await api.get("/superadmin/reports/", {
          params: buildParams(period, startDate, endDate),
        });
        const nextReports = normalizeReports(reportsRes.data);
        setReports(nextReports);
        setStats(nextReports?.stats ?? {});
      } catch {
        setStatsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [period, startDate, endDate]);

  const handleExport = async (reportId: string = "all") => {
    if (period === "custom" && (!startDate || !endDate)) return;
    setExportingReportId(reportId);
    setStatsError(false);
    setExportError("");

    try {
      const response = await api.get("/superadmin/reports/export/", {
        params: {
          ...buildParams(period, startDate, endDate),
          report_type: reportId,
        },
        responseType: "blob",
      });
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
      const contentDisposition = response.headers["content-disposition"];
      const filename = getFilename(
        typeof contentDisposition === "string" ? contentDisposition : undefined,
        `${reportId}-report.xlsx`
      );
      downloadBlob(blob, filename);
    } catch (error) {
      let message = "Could not download the report. Please try again.";
      const maybeBlob = (error as { response?: { data?: unknown } }).response?.data;
      if (maybeBlob instanceof Blob) {
        try {
          const text = await maybeBlob.text();
          const data = JSON.parse(text) as { error?: string; detail?: string };
          message = data.error ?? data.detail ?? message;
        } catch {
          message = "Could not download the report. Please check the backend server.";
        }
      }
      setExportError(message);
    } finally {
      setExportingReportId(null);
    }
  };

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
        <ReportsHeader onExport={() => handleExport("all")} isExporting={exportingReportId === "all"} />
        <ReportsFiltersBar
          filters={filterOptions}
          activePeriod={period}
          startDate={startDate}
          endDate={endDate}
          onPeriodChange={setPeriod}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {period === "custom" && (!startDate || !endDate) && (
          <div className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#4B5563]">
            Choose a start and end date to load the custom report range.
          </div>
        )}

        {isLoading && (
          <div className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#4B5563]">
            Loading live report data...
          </div>
        )}

        {statsError && (
          <div className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
            Could not load live report data.
          </div>
        )}

        {exportError && (
          <div className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm text-[#B91C1C]">
            {exportError}
          </div>
        )}

        <ReportsKpiGrid cards={kpiCards} />

        <div className="grid gap-3 xl:grid-cols-2">
          <RevenueTrendCard data={revenueTrendData} />
          <UserGrowthCard data={userGrowthData} />
        </div>

        <AnalyticsCardsGrid cards={analyticsCards} />
        <DetailedReportsTable
          rows={reportRows}
          onDownload={handleExport}
          downloadingReportId={exportingReportId}
        />
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import WelcomeBanner from "./WelcomeBanner";
import MetricsGrid from "./MetricsGrid";
import MainPanels from "./MainPanels";
import BottomPanels from "./BottomPanels";

export type OverviewStats = {
  total_users: number;
  total_orders: number;
  total_products: number;
  total_revenue: number;
  total_events: number;
  total_consultations: number;
};

export default function AdminOverviewDashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/supperadmin/stats/");
        setStats(res.data);
      } catch {
        setFetchError("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="w-full bg-white px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <WelcomeBanner />

        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading dashboard stats...
          </div>
        )}
        {fetchError && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {fetchError}
          </div>
        )}

        {!isLoading && <MetricsGrid stats={stats} />}
        <MainPanels />
        <BottomPanels />
      </div>
    </section>
  );
}

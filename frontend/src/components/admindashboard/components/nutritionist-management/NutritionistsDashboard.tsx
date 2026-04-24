"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import NutritionistFiltersCard from "./components/NutritionistFiltersCard";
import NutritionistStatsGrid from "./components/NutritionistStatsGrid";
import NutritionistsDataTable from "./components/NutritionistsDataTable";
import NutritionistsHeader from "./components/NutritionistsHeader";
import type { NutritionistRow, NutritionistStatCard } from "./nutritionistTypes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiConsultant(item: Record<string, any>, index: number): NutritionistRow {
  const user = item.user ?? {};
  const sessionType = String(item.session_type ?? "video").toLowerCase();

  const supportChannels: Array<"video" | "audio" | "chat"> = [];
  if (sessionType.includes("video")) supportChannels.push("video");
  if (sessionType.includes("audio")) supportChannels.push("audio");
  if (sessionType.includes("chat")) supportChannels.push("chat");
  if (supportChannels.length === 0) supportChannels.push("video");

  return {
    id: String(item.id ?? `c-${index}`),
    name: String(user.full_name ?? user.name ?? item.name ?? "Unknown"),
    avatar: String(user.photo ?? user.avatar ?? item.avatar ?? "https://i.pravatar.cc/100?img=1"),
    status: "Active",
    availability: "Available",
    qualification: String(item.qualification ?? "—"),
    email: String(user.email ?? item.email ?? "—"),
    phone: String(user.phone ?? item.phone ?? "—"),
    expertiseTags: item.specialization
      ? [String(item.specialization)]
      : item.expertise
      ? String(item.expertise).split(",").map((s: string) => s.trim())
      : [`${item.years_of_experience ?? "0"} yrs experience`],
    sessions: parseInt(item.total_sessions ?? item.sessions ?? 0, 10),
    rating: parseFloat(item.rating ?? item.average_rating ?? 4.5),
    supportChannels,
  };
}

function buildStats(rows: NutritionistRow[]): NutritionistStatCard[] {
  const total = rows.length;
  const active = rows.filter((r) => r.status === "Active").length;
  const available = rows.filter((r) => r.availability === "Available").length;
  const topRated = rows.reduce(
    (best, r) => (r.rating > best.rating ? r : best),
    { name: "—", rating: 0 } as { name: string; rating: number }
  );
  const totalSessions = rows.reduce((sum, r) => sum + r.sessions, 0);

  return [
    { id: "total", label: "Total", value: String(total), subText: "Total Nutritionists", icon: "users", iconTone: "green" },
    { id: "active", label: "Active", value: String(active), subText: "Active Experts", icon: "check", iconTone: "gold" },
    { id: "today", label: "Today", value: String(available), subText: "Available Today", icon: "calendar", iconTone: "gold" },
    { id: "top", label: String(topRated.rating || "—"), value: topRated.name, subText: "Highest Rated Expert", icon: "star", iconTone: "teal" },
    { id: "busy", label: "Busy", value: String(total - available), subText: "Fully Booked", icon: "clock", iconTone: "gold" },
    { id: "inactive", label: "Inactive", value: String(total - active), subText: "Inactive Experts", icon: "pause", iconTone: "gray" },
    { id: "assigned", label: "Assigned", value: "—", subText: "Assigned Consultations", icon: "list", iconTone: "teal" },
    { id: "done", label: "Done", value: String(totalSessions), subText: "Completed Sessions", icon: "done", iconTone: "gold" },
  ];
}

export default function NutritionistsDashboard() {
  const [rows, setRows] = useState<NutritionistRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/consultant/consultants/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : [];
        setRows(raw.map(mapApiConsultant));
      } catch {
        setFetchError("Failed to load nutritionists");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  const stats = useMemo(() => buildStats(rows), [rows]);

  return (
    <section className="w-full bg-[#F7F8FA] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[1180px] space-y-4">
        <NutritionistsHeader />
        <NutritionistStatsGrid items={stats} />
        <NutritionistFiltersCard />

        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading nutritionists...
          </div>
        )}
        {fetchError && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {fetchError}
          </div>
        )}
        {!isLoading && !fetchError && rows.length === 0 && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-8 text-center text-sm text-[#6B7280]">
            No nutritionists found.
          </div>
        )}

        {!isLoading && rows.length > 0 && (
          <NutritionistsDataTable rows={rows} />
        )}
      </div>
    </section>
  );
}

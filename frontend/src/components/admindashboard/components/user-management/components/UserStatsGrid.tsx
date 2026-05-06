"use client";

import { useEffect, useMemo, useState } from "react";
import { Crown, ShieldAlert, UserCheck, UserMinus, UserPlus, Users } from "lucide-react";
import api from "@/services/api";
import type { UserRecord } from "../userManagementShared";

type StatsData = {
  total: number;
  active: number;
  inactive: number;
};

function calculateStats(users: UserRecord[]): StatsData {
  const total = users.length;
  const active = users.filter((user) => user.isActive).length;
  return { total, active, inactive: total - active };
}

type Props = {
  users?: UserRecord[];
};

export default function UserStatsGrid({ users }: Props) {
  const [fetchedStats, setFetchedStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(!users);
  const stats = useMemo(() => (users ? calculateStats(users) : fetchedStats), [fetchedStats, users]);

  useEffect(() => {
    if (users) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get("/supperadmin/users/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw: Record<string, any>[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.results)
          ? res.data.results
          : Array.isArray(res.data?.users)
          ? res.data.users
          : [];

        const total = raw.length;
        const active = raw.filter((u) => Boolean(u.is_active)).length;
        const inactive = total - active;

        setFetchedStats({ total, active, inactive });
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [users]);

  const fmt = (n: number) => n.toLocaleString();
  const val = (n: number | undefined) => (stats != null && n != null ? fmt(n) : isLoading ? "…" : "—");

  const summaryCards = [
    { label: "Total Users", value: val(stats?.total), change: "", hint: "", Icon: Users, iconBg: "bg-[#E7EFEA]", iconColor: "text-[#0A4833]", changeColor: "text-[#16A34A]" },
    { label: "Active Members", value: val(stats?.active), change: "", hint: "", Icon: UserCheck, iconBg: "bg-[#F2EEE7]", iconColor: "text-[#A88751]", changeColor: "text-[#16A34A]" },
    { label: "New This Week", value: "—", change: "", hint: "", Icon: UserPlus, iconBg: "bg-[#EAF1FF]", iconColor: "text-[#3B82F6]", changeColor: "text-[#16A34A]" },
    { label: "Inactive Users", value: val(stats?.inactive), change: "", hint: "", Icon: UserMinus, iconBg: "bg-[#FFF6D9]", iconColor: "text-[#D4A500]", changeColor: "text-[#DC2626]" },
    { label: "Suspended", value: "—", change: "", hint: "", Icon: ShieldAlert, iconBg: "bg-[#FFEDEE]", iconColor: "text-[#EF4444]", changeColor: "text-[#EF4444]" },
    { label: "Premium Members", value: "—", change: "", hint: "", Icon: Crown, iconBg: "bg-[#F2EAFE]", iconColor: "text-[#A855F7]", changeColor: "text-[#16A34A]" },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {summaryCards.map(({ label, value, change, hint, Icon, iconBg, iconColor, changeColor }) => (
        <article key={label} className="rounded-xl border border-[#DFDFDF] bg-white p-4">
          <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <p className="text-[38px] font-semibold leading-none text-[#0A4833]">{value}</p>
          <p className="mt-1 text-base text-[#4B5563]">{label}</p>
          {(change || hint) && (
            <p className="mt-1 text-sm">
              {change && <span className={changeColor}>{change}</span>}
              {hint && <span className="text-[#6B7280]"> {hint}</span>}
            </p>
          )}
        </article>
      ))}
    </section>
  );
}

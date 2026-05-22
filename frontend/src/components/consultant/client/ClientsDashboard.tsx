"use client";

import { useEffect, useMemo, useState } from "react";
import ClientDetailsPanel from "./ClientDetailsPanel";
import ClientHeader from "./ClientHeader";
import ClientList from "./ClientList";
import ClientProfileModal from "./ClientProfileModal";
import ClientStatsGrid from "./ClientStatsGrid";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import type { BackendClientItem, ClientGoal, ClientStatCard, ClientStatus } from "./clientTypes";

const INITIAL_VISIBLE_COUNT = 3;

type ApiClient = {
  id: number;
  client_profile_id: number;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string | null;
  gender?: string | null;
  location?: string | null;
  photo?: string | null;
  booking_status?: string;
  last_consultation?: string | null;
  primary_goal?: string;
  primary_wellness_goal?: string;
  focuses_area?: string;
  diet_preferences?: string;
  lifestyle_activity_level?: string;
  buckwheat_journey_goal?: string;
  language?: string;
  message?: string;
  is_active?: boolean;
  created_at?: string;
};

function mediaUrl(value?: string | null) {
  if (!value) return "/recipe/recipe-3.webp";
  return getImageUrl(value);
}

function formatGoal(value?: string): ClientGoal {
  const text = String(value || "").toLowerCase();
  if (text.includes("weight")) return "Weight Loss";
  if (text.includes("muscle")) return "Muscle Gain";
  if (text.includes("digest")) return "Digestive Health";
  return "General Health";
}

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function calculateAge(value?: string | null) {
  if (!value) return 0;
  const birthDate = new Date(value);
  if (Number.isNaN(birthDate.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age -= 1;
  return Math.max(0, age);
}

function mapClient(item: ApiClient): BackendClientItem {
  const goal = formatGoal(item.primary_goal || item.primary_wellness_goal);
  const status: ClientStatus = item.is_active === false ? "Follow-up Due" : "Active";

  return {
    id: String(item.id),
    name: item.full_name || item.email || "Client",
    age: calculateAge(item.date_of_birth),
    gender: item.gender || "-",
    avatar: mediaUrl(item.photo),
    status,
    goal,
    allergies: [],
    dietPreference: item.diet_preferences || "-",
    lastConsultation: formatDate(item.last_consultation),
    planName: item.buckwheat_journey_goal || "No diet plan assigned",
    activeSince: formatDate(item.created_at?.slice(0, 10)),
    currentWeight: "-",
    targetWeight: "-",
    bmi: "-",
    latestNotes: item.message || "No notes added yet.",
    healthSummary: item.focuses_area || item.primary_wellness_goal || "-",
    weightLost: "-",
    adherence: 0,
    progressSummary: item.lifestyle_activity_level || "-",
    email: item.email || "-",
    phone: item.phone || "-",
    nextSession: item.booking_status === "confirmed" ? formatDate(item.last_consultation) : "Not scheduled",
  };
}

export default function ClientsDashboard() {
  const [clientsFromBackend, setClientsFromBackend] = useState<BackendClientItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState<ClientStatus | "All Status">("All Status");
  const [goalValue, setGoalValue] = useState<ClientGoal | "All Goals">("All Goals");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [expandedClient, setExpandedClient] = useState<BackendClientItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiClient[]>("/consultant/clients/")
      .then(({ data }) => {
        if (!isMounted) return;
        const mappedClients = Array.isArray(data) ? data.map(mapClient) : [];
        setClientsFromBackend(mappedClients);
        setSelectedClientId(mappedClients[0]?.id ?? "");
      })
      .catch(() => {
        if (!isMounted) return;
        setClientsFromBackend([]);
        setSelectedClientId("");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredClients = useMemo(() => {
    return clientsFromBackend.filter((client) => {
      const matchesSearch =
        searchValue.trim().length === 0 ||
        client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.goal.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.planName.toLowerCase().includes(searchValue.toLowerCase());

      const matchesStatus = statusValue === "All Status" || client.status === statusValue;
      const matchesGoal = goalValue === "All Goals" || client.goal === goalValue;

      return matchesSearch && matchesStatus && matchesGoal;
    });
  }, [clientsFromBackend, goalValue, searchValue, statusValue]);

  const selectedClient = filteredClients.find((client) => client.id === selectedClientId) ?? filteredClients[0] ?? null;

  const stats = useMemo<ClientStatCard[]>(() => {
    return [
      { id: "total", label: "Total Clients", value: clientsFromBackend.length, tone: "text-[#0A4833]" },
      { id: "active", label: "Active Clients", value: clientsFromBackend.filter((item) => item.status === "Active").length, tone: "text-[#16A34A]" },
      { id: "new", label: "New Clients", value: clientsFromBackend.filter((item) => item.status === "New").length, tone: "text-[#B26B12]" },
      { id: "followUp", label: "Follow-up Due", value: clientsFromBackend.filter((item) => item.status === "Follow-up Due").length, tone: "text-[#EA580C]" },
      { id: "priority", label: "High Priority", value: clientsFromBackend.filter((item) => item.status === "High Priority").length, tone: "text-[#DC2626]" },
    ];
  }, [clientsFromBackend]);

  return (
    <>
      <main className="min-h-screen bg-[#FCFCFB] px-4 py-6 lg:px-6">
        <div className="mx-auto max-w-[1220px] space-y-5">
          <ClientHeader
            searchValue={searchValue}
            statusValue={statusValue}
            goalValue={goalValue}
            onSearchChange={(value) => {
              setSearchValue(value);
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            onStatusChange={(value) => {
              setStatusValue(value);
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            onGoalChange={(value) => {
              setGoalValue(value);
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
          />

          <ClientStatsGrid stats={stats} />

          {isLoading ? (
            <section className="rounded-[14px] border border-[#DFDFDF] bg-white p-5 text-sm text-[#4B5563]">
              Loading clients...
            </section>
          ) : null}

          {!isLoading && clientsFromBackend.length === 0 ? (
            <section className="rounded-[14px] border border-[#DFDFDF] bg-white p-5">
              <p className="text-sm font-semibold text-[#0A4833]">No approved clients yet.</p>
              <p className="mt-1 text-sm text-[#6B7280]">Approved consultation bookings will appear here.</p>
            </section>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_360px]">
            <ClientList
              clients={filteredClients}
              selectedClientId={selectedClient?.id ?? ""}
              onSelect={(client) => setSelectedClientId(client.id)}
              onOpenProfile={setExpandedClient}
              visibleCount={visibleCount}
              onLoadMore={() => setVisibleCount((current) => current + INITIAL_VISIBLE_COUNT)}
            />

            {selectedClient ? <ClientDetailsPanel client={selectedClient} onOpenProfile={setExpandedClient} /> : null}
          </div>
        </div>
      </main>

      <ClientProfileModal client={expandedClient} onClose={() => setExpandedClient(null)} />
    </>
  );
}

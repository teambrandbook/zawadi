"use client";

import { useMemo, useState } from "react";
import ClientDetailsPanel from "./ClientDetailsPanel";
import ClientHeader from "./ClientHeader";
import { backendClients } from "./clientData";
import ClientList from "./ClientList";
import ClientProfileModal from "./ClientProfileModal";
import ClientStatsGrid from "./ClientStatsGrid";
import type { BackendClientItem, ClientGoal, ClientStatCard, ClientStatus } from "./clientTypes";

const INITIAL_VISIBLE_COUNT = 3;

export default function ClientsDashboard() {
  const clientsFromBackend = useMemo(() => backendClients, []);
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState<ClientStatus | "All Status">("All Status");
  const [goalValue, setGoalValue] = useState<ClientGoal | "All Goals">("All Goals");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [selectedClientId, setSelectedClientId] = useState(clientsFromBackend[0]?.id ?? "");
  const [expandedClient, setExpandedClient] = useState<BackendClientItem | null>(null);

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

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { initialUsers, PER_PAGE, toCsv } from "./userManagementShared";
import type { UserRecord } from "./userManagementShared";
import UserFiltersBar from "./components/UserFiltersBar";
import UserManagementHeader from "./components/UserManagementHeader";
import UserStatsGrid from "./components/UserStatsGrid";
import UsersDataTable from "./components/UsersDataTable";
import api, { getAccessToken } from "@/services/api";

function mapApiUsers(rawUsers: Record<string, unknown>[]): UserRecord[] {
  return rawUsers.map((item, index) => {
    const userIdValue = item.user_id ?? item.id ?? `user-${index + 1}`;
    const fullName = String(item.full_name ?? item.name ?? "Unknown User");
    const email = String(item.email ?? "-");
    const phone = String(item.phone ?? "-");
    const role = String(item.role ?? "user");
    const isActive = Boolean(item.is_active);

    return {
      id: String(userIdValue),
      userId: String(userIdValue),
      fullName,
      email,
      phone,
      role,
      isActive,
      status: isActive ? "Active" : "Inactive",
      activity: isActive ? "Currently Active" : "Currently Inactive",
      lastLogin: "N/A",
      photo: typeof item.photo === "string" ? item.photo : null,
    };
  });
}

function extractRawUsers(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];

  if (payload && typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;
    if (Array.isArray(objectPayload.results)) return objectPayload.results as Record<string, unknown>[];
    if (Array.isArray(objectPayload.data)) return objectPayload.data as Record<string, unknown>[];
    if (Array.isArray(objectPayload.users)) return objectPayload.users as Record<string, unknown>[];
  }

  return [];
}

export default function UserManagementDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleFilter, setRoleFilter] = useState("All Role");
  const [period, setPeriod] = useState("Last 30 days");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAccessToken();

        const res = await api.get("/supperadmin/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const users = mapApiUsers(extractRawUsers(res.data));
        setUsers(users);
      } catch (error) {
        console.log("Error:", error);
        setFetchError("Error fetching users");
      }
    };

    fetchUser();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All Status" || user.status === statusFilter;
      const matchesRole = roleFilter === "All Role" || user.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PER_PAGE));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filteredUsers.slice(start, start + PER_PAGE);
  }, [filteredUsers, page]);

  const allVisibleSelected = paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedIds.includes(u.id));
  const selectedUsers = users.filter((user) => selectedIds.includes(user.id));

  function resetToFirstPage() {
    setPage(1);
  }

  function downloadCsv(filename: string, rows: UserRecord[]) {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function toggleSelectAllVisible() {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedUsers.some((u) => u.id === id)));
      return;
    }

    setSelectedIds((prev) => [...new Set([...prev, ...paginatedUsers.map((u) => u.id)])]);
  }

  function toggleSelectOne(userId: string) {
    setSelectedIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  }

  function handleAddUser() {
    router.push("/admindashboard/users/create");
  }

  function handleClearFilters() {
    setSearchQuery("");
    setStatusFilter("All Status");
    setRoleFilter("All Role");
    setSelectedIds([]);
    setPage(1);
  }

  function handleQuickFilter() {
    setStatusFilter((prev) => {
      if (prev === "All Status") return "Active";
      if (prev === "Active") return "Inactive";
      if (prev === "Inactive") return "All Status";
      return "All Status";
    });
    resetToFirstPage();
  }

  function handleBulkEmail() {
    if (selectedUsers.length === 0) {
      window.alert("Select at least one user to send a bulk email.");
      return;
    }
    const recipients = selectedUsers.map((user) => user.email).join(", ");
    window.alert(`Bulk email sent to: ${recipients}`);
  }

  function handleExportSelected() {
    if (selectedUsers.length === 0) {
      window.alert("Select at least one user to export.");
      return;
    }
    downloadCsv("users-selected.csv", selectedUsers);
  }

  function handleRowAction(action: "view" | "edit" | "more", user: UserRecord) {
    if (action === "view") {
      window.alert(`Viewing ${user.fullName} (${user.userId})`);
      return;
    }
    if (action === "edit") {
      window.alert(`Editing ${user.fullName} (${user.userId})`);
      return;
    }
    window.alert(`More actions for ${user.fullName}`);
  }

  return (
    <section className="w-full bg-white p-4 lg:p-6">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <UserManagementHeader
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            resetToFirstPage();
          }}
          period={period}
          onPeriodChange={setPeriod}
          onQuickFilter={handleQuickFilter}
          onExportAll={() => downloadCsv("users-all.csv", filteredUsers)}
          onAddUser={handleAddUser}
        />

        <UserStatsGrid />

        <UserFiltersBar
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          onStatusChange={(value) => {
            setStatusFilter(value);
            resetToFirstPage();
          }}
          onRoleChange={(value) => {
            setRoleFilter(value);
            resetToFirstPage();
          }}
          onClearFilters={handleClearFilters}
          onBulkEmail={handleBulkEmail}
          onExportSelected={handleExportSelected}
        />

        {isLoading && (
          <div className="rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#4B5563]">
            Loading users...
          </div>
        )}

        {fetchError && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {fetchError}
          </div>
        )}

        <UsersDataTable
          users={paginatedUsers}
          selectedIds={selectedIds}
          allVisibleSelected={allVisibleSelected}
          onToggleSelectAll={toggleSelectAllVisible}
          onToggleSelectOne={toggleSelectOne}
          onRowAction={handleRowAction}
          page={page}
          totalPages={totalPages}
          perPage={PER_PAGE}
          totalResults={filteredUsers.length}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}

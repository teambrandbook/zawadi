"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { displayRole, initialUsers, PER_PAGE, toCsv } from "./userManagementShared";
import type { UserRecord } from "./userManagementShared";
import UserFiltersBar from "./components/UserFiltersBar";
import UserManagementHeader from "./components/UserManagementHeader";
import UserStatsGrid from "./components/UserStatsGrid";
import UserDetailsModal from "./components/UserDetailsModal";
import UsersDataTable from "./components/UsersDataTable";
import api from "@/services/api";
import { getImageUrl } from "@/lib/utils";
import { useInternalStaffPermissions } from "@/components/admindashboard/shared/InternalStaffPermissionsBootstrap";
import type { RootState } from "@/redux/store";

function toUserPhotoUrl(photo?: string | null) {
  if (!photo) return null;
  return getImageUrl(photo);
}

function mapApiUsers(rawUsers: Record<string, unknown>[]): UserRecord[] {
  return rawUsers.map((item, index) => {
    const idValue = item.id ?? `user-${index + 1}`;
    const userIdValue = item.user_id ?? item.id ?? `user-${index + 1}`;
    const fullName = String(item.full_name ?? item.name ?? "Unknown User");
    const email = String(item.email ?? "-");
    const phone = String(item.phone ?? "-");
    const role = String(item.role ?? "user");
    const isActive = Boolean(item.is_active);
    const communityuser =
      item.communityuser && typeof item.communityuser === "object"
        ? {
            user_type: String((item.communityuser as Record<string, unknown>).user_type ?? "-"),
            wellness_interests: String((item.communityuser as Record<string, unknown>).wellness_interests ?? "-"),
            diet_preference: String((item.communityuser as Record<string, unknown>).diet_preference ?? "-"),
            preferred_communication: String((item.communityuser as Record<string, unknown>).preferred_communication ?? "-"),
          }
        : null;

    return {
      id: String(idValue),
      userId: String(userIdValue),
      fullName,
      email,
      phone,
      role,
      isActive,
      status: isActive ? "Active" : "Inactive",
      activity: isActive ? "Currently Active" : "Currently Inactive",
      lastLogin: "N/A",
      photo: typeof item.photo === "string" ? toUserPhotoUrl(item.photo) : null,
      communityuser,
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

function DeleteUserConfirmDialog({
  user,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  user: UserRecord;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-[#0A4833]">Delete User</h2>
        <p className="mt-2 text-sm text-[#4B5563]">
          Are you sure you want to delete <span className="font-medium text-[#0A4833]">{user.fullName}</span>?
        </p>
        <p className="mt-1 text-sm text-[#6B7280]">This action cannot be undone.</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-md border border-[#D1D5DB] px-4 py-2 text-sm text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-[#DC2626] px-4 py-2 text-sm font-medium text-white hover:bg-[#B91C1C] disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagementDashboard() {
  const router = useRouter();
  const role = useSelector((state: RootState) => state.user.role);
  const internalStaffPermissions = useInternalStaffPermissions();
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleFilter, setRoleFilter] = useState("All Role");
  const [period, setPeriod] = useState("Last 30 days");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const usersPermission = internalStaffPermissions.find(
    (permission) => permission.module === "users"
  );
  const canCreateUser =
    role !== "internal_staff" ||
    Boolean(usersPermission && (usersPermission.can_create || usersPermission.full_access));
  const canEditUser =
    role !== "internal_staff" ||
    Boolean(usersPermission && (usersPermission.can_edit || usersPermission.full_access));
  const canDeleteUser =
    role !== "internal_staff" ||
    Boolean(usersPermission && (usersPermission.can_delete || usersPermission.full_access));
  const canExportUsers =
    role !== "internal_staff" ||
    Boolean(usersPermission && (usersPermission.can_export || usersPermission.full_access));

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await api.get("/superadmin/users/");

        const users = mapApiUsers(extractRawUsers(res.data));
        console.log(users);
        
        setUsers(users);
      } catch (error) {
        console.log("Error:", error);
        setFetchError("Error fetching users");
      } finally {
        setIsLoading(false);
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
      const matchesRole =
        roleFilter === "All Role" ||
        user.role.toLowerCase() === roleFilter.toLowerCase() ||
        displayRole(user).toLowerCase() === roleFilter.toLowerCase();

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
      toast.warning("Select at least one user to send a bulk email.");
      return;
    }
    const recipients = selectedUsers.map((user) => user.email).join(", ");
    toast.success(`Bulk email queued for: ${recipients}`);
  }

  function handleExportSelected() {
    if (selectedUsers.length === 0) {
      toast.warning("Select at least one user to export.");
      return;
    }
    downloadCsv("users-selected.csv", selectedUsers);
  }

  async function confirmDeleteUser() {
    if (!deleteTarget) return;

    setIsDeletingUser(true);
    try {
      await api.delete(`/superadmin/users/${deleteTarget.id}/`);
      setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setSelectedUser((prev) => (prev?.id === deleteTarget.id ? null : prev));
      toast.success("User deleted successfully.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setIsDeletingUser(false);
    }
  }

  function handleRowAction(action: "view" | "edit" | "delete", user: UserRecord) {
    if (action === "edit") {
      router.push(`/admindashboard/users/create?userId=${encodeURIComponent(user.id)}`);
      return;
    }
    if (action === "view") {
      setSelectedUser(user);
      return;
    }
    setDeleteTarget(user);
  }

  return (
    <section className="w-full bg-white p-4 lg:p-6">
      {deleteTarget ? (
        <DeleteUserConfirmDialog
          user={deleteTarget}
          isDeleting={isDeletingUser}
          onConfirm={confirmDeleteUser}
          onCancel={() => {
            if (!isDeletingUser) setDeleteTarget(null);
          }}
        />
      ) : null}

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
          canAddUser={canCreateUser}
          canExportUsers={canExportUsers}
        />

        <UserStatsGrid users={users} />

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
          canExportUsers={canExportUsers}
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
          canEditUser={canEditUser}
          canDeleteUser={canDeleteUser}
        />

        <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      </div>
    </section>
  );
}

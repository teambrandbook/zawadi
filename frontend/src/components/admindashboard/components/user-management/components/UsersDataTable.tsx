/* eslint-disable @next/next/no-img-element */

import { ChevronLeft, ChevronRight, Ellipsis, Eye, Pencil, UserCheck, UserMinus } from "lucide-react";
import { statusClass } from "../userManagementShared";
import type { UserRecord } from "../userManagementShared";

type Props = {
  users: UserRecord[];
  selectedIds: string[];
  allVisibleSelected: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onRowAction: (action: "view" | "edit" | "more", user: UserRecord) => void;
  page: number;
  totalPages: number;
  perPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
};

export default function UsersDataTable({
  users,
  selectedIds,
  allVisibleSelected,
  onToggleSelectAll,
  onToggleSelectOne,
  onRowAction,
  page,
  totalPages,
  perPage,
  totalResults,
  onPageChange,
}: Props) {
  const safePage = Math.min(page, totalPages);

  return (
    <section className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-left">
          <thead className="bg-[#D9D9D9] text-sm text-[#374151]">
            <tr>
              <th className="w-12 px-4 py-4">
                <input type="checkbox" checked={allVisibleSelected} onChange={onToggleSelectAll} className="h-4 w-4 rounded border-[#9CA3AF]" />
              </th>
              <th className="px-4 py-4">User</th>
              <th className="px-4 py-4">User ID</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Phone</th>
              <th className="px-4 py-4">Role</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Activity</th>
              <th className="px-4 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-[#DFDFDF] text-sm text-[#111827]">
                <td className="px-4 py-4 align-middle">
                  <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => onToggleSelectOne(user.id)} className="h-4 w-4 rounded border-[#9CA3AF]" />
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.photo || "/logo/zawadi-logo.webp"} alt={user.fullName} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-[15px] font-semibold text-[#0A4833]">{user.fullName}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-[#4B5563]">{user.userId}</td>

                <td className="px-4 py-4 text-[#4B5563]">{user.email}</td>
                <td className="px-4 py-4 text-[#4B5563]">{user.phone}</td>
                <td className="px-4 py-4 text-[#4B5563]">{user.role}</td>

                <td className={`px-4 py-4 text-xs font-medium ${statusClass(user.status)}`}>{user.status}</td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {user.isActive ? (
                      <UserCheck className="h-4 w-4 text-[#166534]" />
                    ) : (
                      <UserMinus className="h-4 w-4 text-[#854D0E]" />
                    )}
                    <p>{user.activity}</p>
                  </div>
                  <p className="text-[#4B5563]">Last login: {user.lastLogin}</p>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-[#0A4833]">
                    <button type="button" onClick={() => onRowAction("view", user)} className="hover:text-[#083927]" aria-label={`View ${user.fullName}`}>
                      <Eye className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onRowAction("edit", user)} className="hover:text-[#083927]" aria-label={`Edit ${user.fullName}`}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onRowAction("more", user)} className="hover:text-[#083927]" aria-label={`More actions for ${user.fullName}`}>
                      <Ellipsis className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-[#6B7280]">
                  No users found for the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DFDFDF] px-4 py-4 text-sm">
        <p className="text-[#4B5563]">
          Showing {users.length === 0 ? 0 : (safePage - 1) * perPage + 1} to {Math.min(safePage * perPage, totalResults)} of {totalResults} results
        </p>

        <div className="flex items-center gap-2 text-[#6B7280]">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-[#F3F4F6] disabled:opacity-40"
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }).slice(0, 3).map((_, idx) => {
            const pageNumber = idx + 1;
            const isActive = safePage === pageNumber;
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`h-8 min-w-8 rounded px-2 text-sm ${isActive ? "bg-[#0A4833] text-white" : "hover:bg-[#F3F4F6]"}`}
              >
                {pageNumber}
              </button>
            );
          })}

          {totalPages > 4 && <span>...</span>}

          {totalPages > 3 && (
            <button type="button" onClick={() => onPageChange(totalPages)} className="h-8 min-w-8 rounded px-2 hover:bg-[#F3F4F6]">
              {totalPages}
            </button>
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-[#F3F4F6] disabled:opacity-40"
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

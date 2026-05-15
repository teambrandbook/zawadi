import { useMemo, useState } from "react";
import type { NotificationRow } from "../types";

type NotificationsTableProps = {
  rows: NotificationRow[];
};

const PAGE_SIZE = 10;

function priorityTone(priority: NotificationRow["priority"]) {
  if (priority === "High") return "bg-[#FEE2E2] text-[#B91C1C]";
  if (priority === "Medium") return "bg-[#FEF3C7] text-[#92400E]";
  return "bg-[#F1F5F9] text-[#475569]";
}

function statusTone(status: NotificationRow["status"]) {
  if (status === "Sent") return "bg-[#DCFCE7] text-[#15803D]";
  if (status === "Scheduled") return "bg-[#DBEAFE] text-[#1D4ED8]";
  return "bg-[#E5E7EB] text-[#4B5563]";
}

function audienceLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function NotificationsTable({ rows }: NotificationsTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleRows = useMemo(() => rows.slice(startIndex, startIndex + PAGE_SIZE), [rows, startIndex]);
  const firstItem = rows.length === 0 ? 0 : startIndex + 1;
  const lastItem = Math.min(startIndex + PAGE_SIZE, rows.length);

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[#DFDFDF] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0A4833]">Notifications Management</h2>
            <p className="mt-1 text-sm text-[#6B7280]">{rows.length} notifications found</p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-[#F3F0EA] px-3 py-1 text-xs font-semibold text-[#0A4833]">
            Grid View
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left">
            <thead className="bg-[#F8F6F1] text-xs font-semibold uppercase tracking-[0.04em] text-[#0A4833]">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#CFCFCF]" />
                </th>
                <th className="w-[42%] px-4 py-3">Title</th>
                <th className="w-[13%] px-4 py-3">Type</th>
                <th className="w-[13%] px-4 py-3">Audience</th>
                <th className="w-[12%] px-4 py-3">Channel</th>
                <th className="w-[10%] px-4 py-3">Priority</th>
                <th className="w-[10%] px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0F2]">
              {visibleRows.map((row) => (
                <tr key={row.id} className="align-top transition hover:bg-[#FBFAF7]">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="h-4 w-4 rounded border-[#CFCFCF]" />
                  </td>
                  <td className="px-4 py-4">
                    <p className="line-clamp-1 text-sm font-semibold text-[#111827]">{row.title}</p>
                    <p className="mt-1 line-clamp-2 max-w-[520px] text-sm leading-5 text-[#6B7280]">
                      {row.description || "No message body added."}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-[#EAF0FF] px-3 py-1 text-xs font-medium text-[#2563EB]">
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-[#374151]">{audienceLabel(row.audience)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {row.channels.map((channel) => (
                        <span key={`${row.id}-${channel}`} className="rounded-md bg-[#0A4833] px-2.5 py-1 text-xs font-medium text-white">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${priorityTone(row.priority)}`}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusTone(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#E5E7EB] px-5 py-4 text-sm text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {firstItem} to {lastItem} of {rows.length} notifications
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-[#DFDFDF] px-3 py-1.5 font-medium text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="rounded-lg bg-[#0A4833] px-3 py-1.5 font-semibold text-white">
              {currentPage}
            </span>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-[#DFDFDF] px-3 py-1.5 font-medium text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DFDFDF] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-[#6B7280]">Bulk Actions</span>
          <button type="button" className="h-9 rounded-lg bg-[#0A4833] px-4 text-sm font-medium text-white">
            Send Selected
          </button>
          <button type="button" className="h-9 rounded-lg border border-[#DFDFDF] px-4 text-sm font-medium text-[#4B5563]">
            Schedule Selected
          </button>
          <button type="button" className="h-9 rounded-lg border border-[#DFDFDF] px-4 text-sm font-medium text-[#4B5563]">
            Archive Selected
          </button>
        </div>
        <p className="text-sm text-[#6B7280]">0 notifications selected</p>
      </div>
    </section>
  );
}

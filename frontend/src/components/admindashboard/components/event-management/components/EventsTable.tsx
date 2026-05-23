import { Eye, Pencil, Trash2, Wifi } from "lucide-react";
import type { EventRow } from "../types";

type EventsTableProps = {
  rows: EventRow[];
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function EventsTable({ rows, selectedIds = [], onToggleSelect, onToggleSelectAll, onView, onEdit, onDelete }: EventsTableProps) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  return (
    <section className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="bg-[#F3F0EA]">
            <tr className="text-xs text-[#0A4833]">
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="h-3.5 w-3.5 rounded border-[#CFCFCF]"
                />
              </th>
              <th className="px-3 py-3 font-semibold">Event</th>
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Host</th>
              <th className="px-3 py-3 font-semibold">Date &amp; Time</th>
              <th className="px-3 py-3 font-semibold">Type</th>
              <th className="px-3 py-3 font-semibold">Registrations</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-[#E5E7EB] align-top">
                <td className="px-3 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => onToggleSelect?.(row.id)}
                    className="h-3.5 w-3.5 rounded border-[#CFCFCF]"
                  />
                </td>

                <td className="px-3 py-4">
                  <div className="flex items-start gap-3">
                    <img src={row.coverImage} alt={row.title} className="h-12 w-12 rounded-md object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-[#0A4833]">{row.title}</p>
                      <p className="mt-1 text-xs text-[#8AA49B]">{row.subtitle || "No subtitle"}</p>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-4 text-xs text-[#9F8151]">{row.category}</td>

                <td className="px-3 py-4">
                  <p className="text-sm font-medium text-[#0A4833]">{row.hostName}</p>
                </td>

                <td className="px-3 py-4">
                  <p className="text-sm font-medium text-[#0A4833]">{row.dateText}</p>
                  <p className="text-xs text-[#8AA49B]">{row.timeText}</p>
                </td>

                <td className="px-3 py-4">
                  <span
                    className={
                      row.type === "Online"
                        ? "rounded-full bg-[#EEF3FF] px-3 py-1 text-xs text-[#2563EB]"
                        : "rounded-full bg-[#EEF3FF] px-3 py-1 text-xs text-[#1D4ED8]"
                    }
                  >
                    {row.type === "Online" && <Wifi size={12} className="mr-1 inline-block" />}
                    {row.type}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {row.attendeeAvatars.slice(0, 3).map((avatar, idx) => (
                        <img
                          key={`${row.id}-${idx}`}
                          src={avatar}
                          alt="attendee"
                          className="h-6 w-6 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-semibold text-[#9F8151]">{row.registrations}</span>
                  </div>
                </td>

                <td className="px-3 py-4">
                  <span
                    className={
                      row.status === "Published"
                        ? "text-xs font-medium text-[#16A34A]"
                        : row.status === "Cancelled"
                          ? "text-xs font-medium text-[#DC2626]"
                          : "text-xs font-medium text-[#A16207]"
                    }
                  >
                    {row.status}
                  </span>
                </td>

                <td className="px-3 py-4">
                  <div className="flex items-center gap-2 text-[#0A4833]">
                    <button
                      type="button"
                      onClick={() => onView?.(row.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#F3F4F6]"
                      title="View event details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit?.(row.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#F3F4F6]"
                      title="Edit event"
                    >
                      <Pencil size={14} />
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#DC2626] hover:bg-[#FEE2E2]"
                        title="Delete event"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

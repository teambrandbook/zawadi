import type { NotificationRow } from "../types";

type NotificationsTableProps = {
  rows: NotificationRow[];
};

function priorityTone(priority: NotificationRow["priority"]) {
  if (priority === "High") return "bg-[#FFE9E9] text-[#DC2626]";
  if (priority === "Medium") return "bg-[#FFF2CC] text-[#9F8151]";
  return "bg-[#F1F5F9] text-[#64748B]";
}

function statusTone(status: NotificationRow["status"]) {
  if (status === "Sent") return "bg-[#DCFCE7] text-[#15803D]";
  if (status === "Scheduled") return "bg-[#FEE2E2] text-[#B45309]";
  return "bg-[#E5E7EB] text-[#6B7280]";
}

export default function NotificationsTable({ rows }: NotificationsTableProps) {
  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
          <h2 className="text-2xl font-semibold text-[#0A4833]">Notifications Management</h2>
          <div className="text-sm text-[#6B7280]">Grid View</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-[#F3F0EA] text-xs text-[#0A4833]">
              <tr>
                <th className="px-3 py-3"><input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CFCFCF]" /></th>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Audience</th>
                <th className="px-3 py-3">Channel</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[#E5E7EB]">
                  <td className="px-3 py-4 align-top"><input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CFCFCF]" /></td>
                  <td className="px-3 py-4">
                    <p className="text-sm font-medium text-[#111827]">{row.title}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{row.description}</p>
                  </td>
                  <td className="px-3 py-4"><span className="rounded-full bg-[#EAF0FF] px-3 py-1 text-xs text-[#2563EB]">{row.type}</span></td>
                  <td className="px-3 py-4 text-sm text-[#374151]">{row.audience}</td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-1">
                      {row.channels.map((channel) => (
                        <span key={`${row.id}-${channel}`} className="rounded-md bg-[#0A4833] px-2 py-0.5 text-xs text-white">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs ${priorityTone(row.priority)}`}>{row.priority}</span></td>
                  <td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs ${statusTone(row.status)}`}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E5E7EB] px-4 py-4 text-sm text-[#6B7280]">
          <p>Showing 1 to 3 of 127 notifications</p>
          <div className="flex flex-wrap justify-center items-center gap-1">
            <button className="rounded border border-[#DFDFDF] px-3 py-1">Previous</button>
            <button className="rounded bg-[#0A4833] px-3 py-1 text-white">1</button>
            <button className="rounded border border-[#DFDFDF] px-3 py-1">2</button>
            <button className="rounded border border-[#DFDFDF] px-3 py-1">3</button>
            <button className="rounded border border-[#DFDFDF] px-3 py-1">Next</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DFDFDF] bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-[#6B7280]">Bulk Actions:</span>
          <button className="h-9 rounded-md bg-[#0A4833] px-4 text-sm text-white">Send Selected</button>
          <button className="h-9 rounded-md border border-[#DFDFDF] px-4 text-sm text-[#4B5563]">Schedule Selected</button>
          <button className="h-9 rounded-md border border-[#DFDFDF] px-4 text-sm text-[#4B5563]">Archive Selected</button>
        </div>
        <p className="text-sm text-[#6B7280]">0 notifications selected</p>
      </div>
    </section>
  );
}


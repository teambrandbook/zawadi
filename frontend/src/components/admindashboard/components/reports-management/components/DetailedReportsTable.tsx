import { Download, Ellipsis } from "lucide-react";
import type { ReportRow } from "../types";

type DetailedReportsTableProps = {
  rows: ReportRow[];
};

export default function DetailedReportsTable({ rows }: DetailedReportsTableProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
      <div className="border-b border-[#E5E7EB] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#0A4B34]">Detailed Reports</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#F5F1E7] text-xs uppercase text-[#6B7280]">
            <tr>
              <th className="px-4 py-3">Report Type</th>
              <th className="px-4 py-3">Date Range</th>
              <th className="px-4 py-3">Records</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-medium text-[#111827]">{row.reportType}</td>
                <td className="px-4 py-3 text-[#4B5563]">{row.dateRange}</td>
                <td className="px-4 py-3 text-[#4B5563]">{row.records}</td>
                <td
                  className={`px-4 py-3 font-medium ${
                    row.status === "Ready" ? "text-[#0A7A44]" : "text-[#C76A12]"
                  }`}
                >
                  {row.status}
                </td>
                <td className="px-4 py-3 text-[#6B7280]">{row.updatedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 text-[#0A4B34]">
                    <Download size={14} />
                    <Ellipsis size={14} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

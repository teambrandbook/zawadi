import { Download } from "lucide-react";

type ReportsHeaderProps = {
  onExport: () => void;
  isExporting?: boolean;
  canExportReports: boolean;
};

export default function ReportsHeader({ onExport, isExporting = false, canExportReports }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-bold text-[#0A4B34] lg:text-3xl">Reports &amp; Analytics</h1>
        <p className="mt-1 text-xs text-[#6B7280] lg:text-sm">
          Track business performance, platform growth, and community engagement across the ZEWADI ecosystem.
        </p>
      </div>

      {canExportReports && (
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 self-start rounded-md border border-[#9C7A4D] bg-[#9C7A4D] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={14} />
          {isExporting ? "Exporting..." : "Export Report"}
        </button>
      )}
    </div>
  );
}

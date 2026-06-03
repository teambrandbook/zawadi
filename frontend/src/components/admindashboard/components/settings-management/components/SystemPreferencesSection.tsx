import { BarChart3, ChevronDown, Save, Settings2, Wrench } from "lucide-react";
import type { SystemPreferencesSettings } from "../settingsTypes";
import BrowserPushToggle from "@/components/notifications/BrowserPushToggle";

type SystemPreferencesSectionProps = {
  data: SystemPreferencesSettings;
  onChange: (next: SystemPreferencesSettings) => void;
  onSave: () => void;
  onReset: () => void;
  onMaintenanceToggle: (value: boolean) => void;
};

export default function SystemPreferencesSection({ data, onChange, onSave, onReset, onMaintenanceToggle }: SystemPreferencesSectionProps) {
  return (
    <div className="space-y-3">
      <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
        <h3 className="inline-flex items-center gap-2 text-lg font-bold text-[#0A4833]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0A4833]/10">
            <Settings2 size={13} />
          </span>
          Display Settings
        </h3>
        <p className="mt-1 text-xs text-[#4B5563]">Configure visual and layout preferences</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold text-[#0A4833]">Default Dashboard View</p>
            <div className="flex h-9 items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3">
              <select
                value={data.dashboardView}
                onChange={(e) => onChange({ ...data, dashboardView: e.target.value })}
                className="w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none"
              >
                <option>Analytics Overview</option>
                <option>Orders Summary</option>
                <option>Products Overview</option>
                <option>Community Activity</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none shrink-0" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-[#0A4833]">Theme Mode</p>
            <div className="flex h-9 items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3">
              <select
                value={data.themeMode}
                onChange={(e) => onChange({ ...data, themeMode: e.target.value })}
                className="w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none"
              >
                <option>Light Mode</option>
                <option>Dark Mode</option>
                <option>System Default</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none shrink-0" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-[#0A4833]">Date Format</p>
            <div className="flex h-9 items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3">
              <select
                value={data.dateFormat}
                onChange={(e) => onChange({ ...data, dateFormat: e.target.value })}
                className="w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none"
              >
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none shrink-0" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-[#0A4833]">Time Format</p>
            <div className="flex h-9 items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3">
              <select
                value={data.timeFormat}
                onChange={(e) => onChange({ ...data, timeFormat: e.target.value })}
                className="w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none"
              >
                <option>12-hour (AM/PM)</option>
                <option>24-hour</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none shrink-0" />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
        <h3 className="inline-flex items-center gap-2 text-lg font-bold text-[#0A4833]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0A4833]/10">
            <BarChart3 size={13} />
          </span>
          Data Management
        </h3>
        <p className="mt-1 text-xs text-[#4B5563]">Export, backup and sync configurations</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold text-[#0A4833]">Report Export Default</p>
            <div className="flex h-9 items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3">
              <select
                value={data.reportExportDefault}
                onChange={(e) => onChange({ ...data, reportExportDefault: e.target.value })}
                className="w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none"
              >
                <option>PDF Document</option>
                <option>Excel Spreadsheet</option>
                <option>CSV File</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none shrink-0" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-[#0A4833]">Backup Preferences</p>
            <div className="flex h-9 items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3">
              <select
                value={data.backupPreference}
                onChange={(e) => onChange({ ...data, backupPreference: e.target.value })}
                className="w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none"
              >
                <option>Daily at 2:00 AM</option>
                <option>Daily at 11:00 PM</option>
                <option>Weekly</option>
                <option>Manual only</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none shrink-0" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-[#0A4833]">Sync Preferences</p>
            <div className="flex h-9 items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3">
              <select
                value={data.syncPreference}
                onChange={(e) => onChange({ ...data, syncPreference: e.target.value })}
                className="w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none"
              >
                <option>Real-time Sync</option>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Manual</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none shrink-0" />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-[#0A4833]">Default Data Display</p>
            <div className="flex h-9 items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3">
              <select
                value={data.dataDisplayRange}
                onChange={(e) => onChange({ ...data, dataDisplayRange: e.target.value })}
                className="w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none shrink-0" />
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
        <h3 className="inline-flex items-center gap-2 text-lg font-bold text-[#0A4833]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0A4833]/10">
            <Wrench size={13} />
          </span>
          System Controls
        </h3>
        <p className="mt-1 text-xs text-[#4B5563]">Platform behavior and maintenance settings</p>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between rounded-md bg-[#EBE1CF4D] px-3 py-2.5">
            <div>
              <p className="text-sm font-semibold text-[#0A4833]">Maintenance Mode</p>
              <p className="text-[11px] text-[#4B5563]">Temporarily disable public access for updates</p>
            </div>
            <button
              onClick={() => onMaintenanceToggle(!data.maintenanceMode)}
              className={`relative h-6 w-11 rounded-full transition ${
                data.maintenanceMode ? "bg-[#0A4833]" : "bg-[#D1D5DB]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  data.maintenanceMode ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <BrowserPushToggle />

          <div className="flex items-center justify-between rounded-md bg-[#EBE1CF4D] px-3 py-2.5">
            <div>
              <p className="text-sm font-semibold text-[#0A4833]">Auto-refresh Dashboard</p>
              <p className="text-[11px] text-[#4B5563]">Automatically updates data every 30 seconds</p>
            </div>
            <button
              onClick={() => onChange({ ...data, autoRefreshDashboard: !data.autoRefreshDashboard })}
              className={`relative h-6 w-11 rounded-full transition ${
                data.autoRefreshDashboard ? "bg-[#0A4833]" : "bg-[#D1D5DB]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  data.autoRefreshDashboard ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-md bg-[#EBE1CF4D] px-3 py-2.5">
            <div>
              <p className="text-sm font-semibold text-[#0A4833]">System Notifications</p>
              <p className="text-[11px] text-[#4B5563]">Receive alerts for critical system events</p>
            </div>
            <button
              onClick={() => onChange({ ...data, systemNotifications: !data.systemNotifications })}
              className={`relative h-6 w-11 rounded-full transition ${
                data.systemNotifications ? "bg-[#0A4833]" : "bg-[#D1D5DB]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  data.systemNotifications ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-md bg-[#EBE1CF4D] px-3 py-2.5">
            <div>
              <p className="text-sm font-semibold text-[#0A4833]">Advanced Analytics</p>
              <p className="text-[11px] text-[#4B5563]">Enable detailed tracking and insights</p>
            </div>
            <button
              onClick={() => onChange({ ...data, advancedAnalytics: !data.advancedAnalytics })}
              className={`relative h-6 w-11 rounded-full transition ${
                data.advancedAnalytics ? "bg-[#0A4833]" : "bg-[#D1D5DB]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                  data.advancedAnalytics ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </article>

      <article className="rounded-lg border border-[#DFDFDF] bg-white p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#9F8151]">Changes will take effect immediately after saving</p>
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={onReset}
              className="inline-flex h-9 items-center justify-center rounded-md border border-[#DFDFDF] px-4 text-xs font-semibold text-[#0A4833] sm:text-sm"
            >
              Reset to Default
            </button>
            <button
              onClick={onSave}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#0A4833] px-5 text-xs font-semibold text-white sm:text-sm"
            >
              <Save size={12} />
              Save Changes
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

import type { NotificationChannel, NotificationFiltersState, NotificationRow } from "../types";

type Props = {
  filters: NotificationFiltersState;
  onChange: (filters: NotificationFiltersState) => void;
  audienceOptions: string[];
};

const typeOptions: Array<{ value: NotificationRow["typeValue"]; label: string }> = [
  { value: "SYSTEM", label: "System Notice" },
  { value: "ALERT", label: "Alert" },
  { value: "REMINDER", label: "Reminder" },
  { value: "PROMOTIONAL", label: "Promotional" },
];

const channelOptions: NotificationChannel[] = ["In-App", "Email"];

export default function NotificationsFilters({ filters, onChange, audienceOptions }: Props) {
  const update = <K extends keyof NotificationFiltersState>(key: K, value: NotificationFiltersState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <select
          value={filters.status}
          onChange={(event) => update("status", event.target.value as NotificationFiltersState["status"])}
          className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F0EA] px-3 text-sm text-[#111827] outline-none"
        >
          <option value="all">All Status</option>
          <option value="Sent">Sent</option>
          <option value="Scheduled">Scheduled</option>
        </select>
        <select
          value={filters.type}
          onChange={(event) => update("type", event.target.value as NotificationFiltersState["type"])}
          className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F0EA] px-3 text-sm text-[#111827] outline-none"
        >
          <option value="all">All Types</option>
          {typeOptions.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <select
          value={filters.audience}
          onChange={(event) => update("audience", event.target.value)}
          className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F0EA] px-3 text-sm text-[#111827] outline-none"
        >
          <option value="all">All Audiences</option>
          {audienceOptions.map((audience) => (
            <option key={audience} value={audience}>{audience.replace(/_/g, " ")}</option>
          ))}
        </select>
        <select
          value={filters.channel}
          onChange={(event) => update("channel", event.target.value as NotificationFiltersState["channel"])}
          className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F0EA] px-3 text-sm text-[#111827] outline-none"
        >
          <option value="all">All Channels</option>
          {channelOptions.map((channel) => (
            <option key={channel} value={channel}>{channel}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onChange({ status: "all", type: "all", audience: "all", channel: "all", sort: "newest" })}
          className="text-sm text-[#0A4833]"
        >
          Clear Filters
        </button>
        <label className="inline-flex items-center gap-2 text-sm text-[#6B7280]">
          Sort by:
          <select
            value={filters.sort}
            onChange={(event) => update("sort", event.target.value as NotificationFiltersState["sort"])}
            className="h-8 rounded-md border border-[#DFDFDF] bg-white px-2 text-sm text-[#111827] outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </label>
      </div>
    </section>
  );
}

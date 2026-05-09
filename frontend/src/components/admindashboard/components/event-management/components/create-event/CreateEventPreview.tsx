import { CalendarDays, Circle, Globe2, ImageIcon, Tag, User } from "lucide-react";
import type { CreateEventFormData } from "../../types";

type Props = {
  formData: CreateEventFormData;
};

const eventTypeLabels: Record<string, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  seminar: "Seminar",
  community: "Community Meetup",
  other: "Other",
};

export default function CreateEventPreview({ formData }: Props) {
  const title = formData.title.trim() || "Event Title";
  const host = formData.institutional_name.trim() || formData.host_type || "N/A";
  const status = formData.status === "draft" ? "Draft" : "Published";
  const rows = [
    { icon: Tag, label: "Category", value: eventTypeLabels[formData.event_type] ?? "Not set", color: "#9F8151" },
    { icon: Globe2, label: "Type", value: formData.is_online ? "Online" : "Offline", color: "#9F8151" },
    { icon: CalendarDays, label: "Date", value: formData.start_date || "Not set", color: "#9F8151" },
    { icon: User, label: "Host", value: host === "N/A" ? "Not set" : host, color: "#9F8151" },
    { icon: Circle, label: "Status", value: status, color: "#9CA3AF" },
  ];

  return (
    <aside id="event-preview" className="xl:sticky xl:top-24 xl:self-start">
      <article className="rounded-[10px] border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <h3 className="text-[18px] font-bold leading-7 tracking-[-0.5px] text-[#0A4833]">Event Preview</h3>
        {formData.banner_preview_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={formData.banner_preview_url} alt={title} className="mt-4 h-[128px] w-full rounded-[6px] object-cover" />
        ) : (
          <div className="mt-4 flex h-[128px] w-full items-center justify-center rounded-[6px] bg-[#DFDFDF] text-[#9CA3AF]">
            <ImageIcon size={24} strokeWidth={2.4} />
          </div>
        )}
        <div className="mt-5">
          <p className="text-[16px] font-bold leading-6 tracking-[-0.5px] text-[#0A4833]">{title}</p>
          <p className="mt-1 text-[12px] leading-5 tracking-[-0.5px] text-[#4B5563]">
            {formData.short_subtitle.trim() || "Event subtitle will appear here"}
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {rows.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3 text-[14px] leading-5 tracking-[-0.5px] text-black">
              <Icon size={16} fill={label === "Status" ? color : "none"} strokeWidth={2.4} style={{ color }} />
              <span>
                {label}: {value}
              </span>
            </div>
          ))}
        </div>
      </article>
    </aside>
  );
}

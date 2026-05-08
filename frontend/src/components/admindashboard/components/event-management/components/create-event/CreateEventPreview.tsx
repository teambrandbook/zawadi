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

function formatDateTime(date: string, time: string) {
  if (!date && !time) return "N/A";
  return [date, time].filter(Boolean).join(" at ");
}

export default function CreateEventPreview({ formData }: Props) {
  const title = formData.title.trim() || "Event Title";
  const host = formData.institutional_name.trim() || formData.host_type || "N/A";
  const access = formData.is_online ? formData.meeting_link.trim() || "Online event" : formData.location.trim() || "Venue not set";

  return (
    <aside id="event-preview" className="xl:sticky xl:top-24 xl:self-start">
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h3 className="text-sm font-semibold text-[#0A4833]">Event Preview</h3>
        {formData.banner_preview_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={formData.banner_preview_url} alt={title} className="mt-3 h-32 w-full rounded-md border border-[#DFDFDF] object-cover" />
        ) : (
          <div className="mt-3 rounded-md border border-[#DFDFDF] bg-[#F7F7F7] p-4 text-center text-xs text-[#9CA3AF]">
            Image
          </div>
        )}
        <div className="mt-3 space-y-1 text-xs text-[#4B5563]">
          <p className="font-semibold text-[#0A4833]">{title}</p>
          <p>1. Category: {eventTypeLabels[formData.event_type] ?? "N/A"}</p>
          <p>2. Type: {formData.is_online ? "Online" : "Offline"}</p>
          <p>3. Host: {host}</p>
          <p>4. Event Fee: Free</p>
          <p>5. Status: {formData.status === "draft" ? "Save as Draft" : "Published"}</p>
          <p>6. Starts: {formatDateTime(formData.start_date, formData.start_time)}</p>
          <p>7. Ends: {formatDateTime(formData.end_date, formData.end_time)}</p>
          <p>8. Timezone: {formData.timezone || "N/A"}</p>
          <p>9. Access: {access}</p>
          <p>10. Attendees: {formData.max_attendees || "Unlimited"}</p>
          <p>11. Registration: {formData.enable_registration ? "Enabled" : "Disabled"}</p>
          <p>12. Community: {formData.show_in_community ? "Visible" : "Hidden"}</p>
          {formData.short_description.trim() && (
            <p className="pt-2 text-[#6B7280]">{formData.short_description}</p>
          )}
          {formData.agenda_highlights.trim() && (
            <p className="text-[#6B7280]">{formData.agenda_highlights}</p>
          )}
        </div>
      </article>
    </aside>
  );
}

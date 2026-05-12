import { CalendarDays, Clock3, Globe2, MapPin, Tag, Users, X } from "lucide-react";
import type { EventDetail } from "../types";

type EventDetailsModalProps = {
  event: EventDetail | null;
  isLoading?: boolean;
  error?: string | null;
  onClose: () => void;
};

const eventCategoryLabels: Record<string, string> = {
  webinar: "Nutrition Session",
  workshop: "Wellness Workshop",
  community: "Community Meetup",
  seminar: "Healthy Eating",
  other: "Buckwheat Awareness",
};

function toMediaUrl(value: unknown) {
  const path = String(value ?? "");
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return `${apiBase.replace(/\/api\/?$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(value?: string | null) {
  if (!value) return "Not set";
  const time = value.slice(0, 5);
  const date = new Date(`2000-01-01T${time}`);
  if (Number.isNaN(date.getTime())) return time;
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatStatus(value?: string) {
  if (value === "published") return "Published";
  if (value === "cancelled") return "Cancelled";
  if (value === "completed") return "Completed";
  return "Draft";
}

function DetailItem({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  const displayValue = typeof value === "boolean" ? (value ? "Yes" : "No") : value || "Not set";
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8AA49B]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#0A4833]">{displayValue}</p>
    </div>
  );
}

export default function EventDetailsModal({ event, isLoading, error, onClose }: EventDetailsModalProps) {
  const imageUrl = toMediaUrl(event?.cover_image);
  const category = eventCategoryLabels[String(event?.event_type ?? "")] ?? event?.event_type ?? "Not set";
  const tags = Array.isArray(event?.event_tags) ? event.event_tags : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 px-4 py-6">
      <section className="mx-auto flex h-[calc(100vh-48px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="shrink-0 flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9F8151]">Event Details</p>
            <h2 className="text-xl font-bold text-[#0A4833]">{event?.title || "Loading event"}</h2>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#0A4833] hover:bg-[#F3F4F6]">
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
          {isLoading && <div className="rounded-lg border border-[#DFDFDF] p-5 text-sm text-[#4B5563]">Loading event details...</div>}
          {error && <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-5 text-sm text-[#B91C1C]">{error}</div>}

          {!isLoading && !error && event && (
            <div className="space-y-5">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={event.title} className="h-56 w-full rounded-lg object-cover" />
              ) : (
                <div className="flex h-56 w-full items-center justify-center rounded-lg bg-[#DFDFDF] text-sm text-[#6B7280]">No image</div>
              )}

              <div>
                <h3 className="text-lg font-bold text-[#0A4833]">{event.title}</h3>
                <p className="mt-1 text-sm text-[#4B5563]">{event.short_subtitle || "No subtitle"}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-[#F7F6F2] p-4">
                  <Tag size={16} className="mb-2 text-[#9F8151]" />
                  <DetailItem label="Category" value={category} />
                </div>
                <div className="rounded-lg bg-[#F7F6F2] p-4">
                  <Globe2 size={16} className="mb-2 text-[#9F8151]" />
                  <DetailItem label="Type" value={event.is_online ? "Online" : "Offline"} />
                </div>
                <div className="rounded-lg bg-[#F7F6F2] p-4">
                  <Users size={16} className="mb-2 text-[#9F8151]" />
                  <DetailItem label="Registrations" value={event.registration_count ?? 0} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <DetailItem label="Host/Speaker" value={event.host_speaker_name} />
                <DetailItem label="Status" value={formatStatus(event.status)} />
                <DetailItem label="Event Date" value={formatDate(event.event_date)} />
                <DetailItem label="Time" value={`${formatTime(event.start_time)} - ${formatTime(event.end_time)}`} />
                <DetailItem label="Timezone" value={event.timezone} />
                <DetailItem label="Maximum Attendees" value={event.max_attendees ?? "Unlimited"} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-[#E5E7EB] p-4">
                  <CalendarDays size={16} className="mb-2 text-[#9F8151]" />
                  <DetailItem label="Registration Deadline" value={event.registration_deadline ? formatDate(event.registration_deadline) : "Not set"} />
                </div>
                <div className="rounded-lg border border-[#E5E7EB] p-4">
                  <Clock3 size={16} className="mb-2 text-[#9F8151]" />
                  <DetailItem label="Repeat Event" value={event.repeat_event} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <DetailItem label="Registration Enabled" value={event.enable_registration} />
                <DetailItem label="Waitlist Enabled" value={event.waitlist_enabled} />
                <DetailItem label="Approval Required" value={event.approval_required} />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-[#0A4833]">Short Description</p>
                  <p className="mt-1 text-sm leading-6 text-[#4B5563]">{event.short_description || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A4833]">Full Description</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{event.full_description || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A4833]">Agenda/Highlights</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{event.agenda_highlights || "Not set"}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0A4833]">
                    <MapPin size={15} />
                    Access
                  </p>
                  <p className="text-sm text-[#4B5563]">{event.is_online ? event.meeting_link || "Online link not set" : event.location || "Location not set"}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A4833]">Tags</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.length > 0 ? tags.map((tag) => <span key={tag} className="rounded-full bg-[#F3F0EA] px-3 py-1 text-xs text-[#0A4833]">{tag}</span>) : <span className="text-sm text-[#4B5563]">No tags</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

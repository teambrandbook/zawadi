import { CalendarDays } from "lucide-react";
import ContentSection from "@/components/common/ContentSection";
import EventJoinActions from "@/components/events/EventJoinActions";
import { getImageUrl } from "@/lib/utils";

export type PublicEventDetail = {
  id: number | string;
  title: string;
  short_subtitle?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  event_type?: string | null;
  cover_image?: string | null;
  agenda_highlights?: string | null;
  event_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  registration_deadline?: string | null;
  is_online?: boolean;
  location?: string | null;
};

function mediaUrl(value?: string | null) {
  if (!value) return "/events/event-1.webp";
  return getImageUrl(value);
}

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatLongDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateValue?: string | null, timeValue?: string | null) {
  if (!dateValue || !timeValue) return "";
  const date = new Date(`${dateValue}T${timeValue}`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTimeRange(event: PublicEventDetail) {
  const start = formatTime(event.event_date, event.start_time);
  const end = formatTime(event.event_date, event.end_time);
  if (start && end) return `${start} - ${end}`;
  return start || end || "-";
}

function categoryLabel(value?: string | null) {
  const labels: Record<string, string> = {
    webinar: "Webinar",
    workshop: "Workshop",
    seminar: "Seminar",
    community: "Community Meetup",
    other: "Wellness Session",
  };
  return value ? labels[value] || value.replaceAll("_", " ") : "Community Meetup";
}

function paragraphs(event: PublicEventDetail) {
  const text = event.full_description || event.short_description || "";
  return text
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function highlights(value?: string | null) {
  if (!value) return [];
  return value
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

export default function PublicEventDetailPage({ event }: { event: PublicEventDetail }) {
  const body = paragraphs(event);
  const agenda = highlights(event.agenda_highlights);
  const summary = event.short_description || event.short_subtitle || "";

  return (
    <main className="bg-[#fffef5] text-[#0e2207]">
      <ContentSection
        title="Zewadi Events"
        subtitle="Zewadi Community Events"
        cardClassName="h-[150px] max-w-[450px] rounded-t-[10px] px-[28px] pt-[34px] pb-0 sm:h-[180px] sm:px-[50px] sm:pt-[44px]"
        titleClassName="font-['Playfair_Display'] text-[34px] font-bold leading-[36px] sm:text-[50px] sm:leading-[40px]"
        subtitleClassName="mt-0 font-['DM_Sans'] text-[13px] font-semibold leading-[32px] text-[#1f6306] sm:text-[16px] sm:leading-[40px]"
      />

      <article className="mx-auto w-full max-w-[1260px] px-4 pb-20 pt-16 sm:px-6 lg:pt-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(event.cover_image)}
          alt={event.title}
          className="h-[220px] w-full rounded-[14px] object-cover sm:h-[340px] lg:h-[462px] lg:rounded-[20px]"
        />

        <div className="mx-auto mt-10 max-w-[850px]">
          <h1 className="font-['Playfair_Display'] text-[34px] font-bold leading-[42px] text-black sm:text-[44px] sm:leading-[54px] lg:text-[50px] lg:leading-[60px]">
            {event.title}
          </h1>

          <div className="mt-4 flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[24px] text-[#111214] sm:text-[16px] sm:leading-[30px]">
            <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{formatDate(event.event_date)}</span>
          </div>

          {summary ? (
            <p className="mt-1 font-['Inter'] text-[13px] font-semibold leading-[24px] text-[#1f4d3a] sm:text-[16px] sm:leading-[30px]">
              {summary}
            </p>
          ) : null}

          <div className="mt-8 space-y-0 font-['Inter'] text-[14px] font-semibold leading-[24px] text-[#1f4d3a] sm:text-[16px] sm:leading-[26px]">
            {body.length > 0 ? (
              body.map((item) => <p key={item}>{item}</p>)
            ) : (
              <p>Event details will be shared soon.</p>
            )}
          </div>

          {agenda.length > 0 ? (
            <section className="mt-9">
              <h2 className="font-['Inter'] text-[18px] font-semibold leading-8 text-[#121212] sm:text-[20px] sm:leading-10">
                Agenda/Highlights
              </h2>
              <ul className="mt-3 list-disc space-y-0 pl-5 font-['Inter'] text-[14px] font-semibold leading-[24px] text-[#1f4d3a] sm:text-[16px] sm:leading-[26px]">
                {agenda.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-9 grid max-w-[760px] grid-cols-1 items-center gap-x-8 gap-y-5 rounded-[5px] border-l-[5px] border-[#1f4d3a] bg-[#f1f5eb] px-6 py-5 sm:grid-cols-[1fr_1fr_auto]">
            <div className="grid gap-x-8 gap-y-5 sm:col-span-2 sm:grid-cols-2">
              <div>
                <p className="font-['Inter'] text-[16px] font-semibold capitalize leading-6 text-[#1f4d3a] sm:text-[18px]">Time</p>
                <p className="mt-1 font-['Inter'] text-[14px] font-medium capitalize leading-6 text-black sm:text-[16px]">
                  {formatTimeRange(event)}
                </p>
              </div>
              <div>
                <p className="font-['Inter'] text-[16px] font-semibold capitalize leading-6 text-[#1f4d3a] sm:text-[18px]">Category</p>
                <p className="mt-1 font-['Inter'] text-[14px] font-medium capitalize leading-6 text-black sm:text-[16px]">
                  {categoryLabel(event.event_type)}
                </p>
              </div>
              <div>
                <p className="font-['Inter'] text-[16px] font-semibold capitalize leading-6 text-[#1f4d3a] sm:text-[18px]">
                  Registrations Deadline
                </p>
                <p className="mt-1 font-['Inter'] text-[14px] font-medium capitalize leading-6 text-black sm:text-[16px]">
                  {formatLongDate(event.registration_deadline)}
                </p>
              </div>
              <div>
                <p className="font-['Inter'] text-[16px] font-semibold capitalize leading-6 text-[#1f4d3a] sm:text-[18px]">Type</p>
                <p className="mt-1 font-['Inter'] text-[14px] font-medium capitalize leading-6 text-black sm:text-[16px]">
                  {event.is_online ? "Online" : event.location || "In Person"}
                </p>
              </div>
            </div>
            <EventJoinActions />
          </section>
        </div>
      </article>
    </main>
  );
}

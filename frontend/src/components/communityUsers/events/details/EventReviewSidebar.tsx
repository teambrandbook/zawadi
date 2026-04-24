import Link from "next/link";
import { CalendarPlus2, CheckCircle2, Share2, Users } from "lucide-react";
import { EventReviewData } from "./types";

type Props = {
  event: EventReviewData;
};

const cardClass =
  "rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]";

export default function EventReviewSidebar({ event }: Props) {
  return (
    <aside className="space-y-6">
      <section className={cardClass}>
        <div className="rounded-full bg-[#DCFCE7] px-4 py-2 text-center text-sm font-medium text-[#166534]">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {event.registrationLabel}
          </span>
        </div>
        <p className="mt-4 text-center text-sm text-[#4B5563]">{event.countdown}</p>

        <div className="mt-6 space-y-3">
          {event.sidebarActions.map((action) => (
            <Link
              key={action.label}
              href={action.href ?? "#"}
              className={`flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
                action.variant === "gold"
                  ? "bg-[#9F8151] text-white hover:bg-[#8D7245]"
                  : action.variant === "outline"
                    ? "border border-[#DFDFDF] text-[#374151] hover:bg-[#F9FAFB]"
                    : action.variant === "danger"
                      ? "text-[#DC2626] hover:bg-[#FEF2F2]"
                      : "bg-[#0A4833] text-white hover:bg-[#083B2A]"
              }`}
            >
              {action.label === "Add to Calendar" && <CalendarPlus2 className="h-4 w-4" />}
              {action.label === "Share Event" && <Share2 className="h-4 w-4" />}
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-[#0A4833]">Event Details</h2>
        <div className="mt-5 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#4B5563]">Attendees</span>
            <span className="font-medium text-[#0A4833]">{event.details.attendees}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#4B5563]">Duration</span>
            <span className="font-medium text-[#111827]">{event.details.duration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#4B5563]">Language</span>
            <span className="font-medium text-[#111827]">{event.details.language}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#4B5563]">Level</span>
            <span className="font-medium text-[#111827]">{event.details.level}</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#DFDFDF] bg-[linear-gradient(150deg,#EBE1CF_0%,#FFFFFF_72%)] p-6">
        <Users className="mx-auto h-7 w-7 text-[#0A4833]" />
        <h2 className="mt-4 text-center text-xl font-semibold text-[#0A4833]">{event.communityCard.title}</h2>
        <p className="mt-3 text-center text-sm leading-6 text-[#4B5563]">{event.communityCard.description}</p>
        <Link
          href={event.communityCard.ctaHref ?? "#"}
          className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#9F8151] px-4 text-sm font-medium text-white hover:bg-[#8D7245]"
        >
          {event.communityCard.ctaLabel}
        </Link>
      </section>
    </aside>
  );
}

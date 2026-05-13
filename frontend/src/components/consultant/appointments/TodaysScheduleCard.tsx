import type { ScheduleItem } from "./appointmentsData";
import Image from "next/image";
import { Check, ExternalLink, Play, X } from "lucide-react";
import { todaySchedule } from "./appointmentsData";

function statusTone(status: string) {
  if (status === "Confirmed") return "text-[#FFFFFF]";
  if (status === "Pending") return "text-[#FFFFFF]";
  if (status === "Available") return "text-[#0A4833]";
  return "text-[#344054]";
}

function actionButtonTone(item: (typeof todaySchedule)[number]) {
  if (item.isEmpty) return "border border-[#A7C4B8] bg-white text-[#0A4833]";
  return "bg-transparent text-[#0A4833]";
}

function appointmentCardTone(item: ScheduleItem) {
  if (item.isEmpty) return "border-dashed border-[#D0D5DD] bg-white";
  if (item.status === "Confirmed") return "border-[#0A4833] bg-[#0A4833]";
  return "border-[#E9DDC8] bg-[#F4EBD8]";
}

type Props = {
  schedule?: ScheduleItem[];
  title?: string;
  dateLabel?: string;
  onSelectAppointment: (appointment: ScheduleItem) => void;
  onOpenDetails: (appointment: ScheduleItem) => void;
  onBookingDecision?: (appointment: ScheduleItem, isAccept: boolean) => void;
};

export default function TodaysScheduleCard({
  schedule = todaySchedule,
  title = "Today&apos;s Schedule",
  dateLabel = "Friday, March 15, 2024",
  onSelectAppointment,
  onOpenDetails,
  onBookingDecision,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E4E7EC] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.04)]">
      <div className="border-b border-[#EAECF0] px-5 py-4">
        <h2 className="text-lg font-semibold text-[#0A4833]">{title}</h2>
        <p className="mt-1 text-xs text-[#98A2B3]">{dateLabel}</p>
      </div>

      <div className="space-y-3 p-4">
        {!schedule.length ? (
          <div className="rounded-[14px] border border-dashed border-[#D0D5DD] bg-white px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[#0A4833]">No appointments found</p>
            <p className="mt-1 text-xs text-[#667085]">
              New community user bookings will appear here for approval.
            </p>
          </div>
        ) : null}

        {schedule.map((item) => (
          <article
            key={`${item.time}-${item.name}`}
            onClick={() => !item.isEmpty && onSelectAppointment(item)}
            className={`grid gap-4 rounded-[14px] border px-4 py-4 md:grid-cols-[74px_minmax(0,1fr)_120px] md:items-center ${
              appointmentCardTone(item)
            } ${item.isEmpty ? "" : "cursor-pointer"}`}
          >
            <div>
              <p className={`text-sm font-semibold ${item.status === "Confirmed" ? "text-white" : "text-[#344054]"}`}>{item.time}</p>
              <p className={`text-xs ${item.status === "Confirmed" ? "text-white/75" : "text-[#98A2B3]"}`}>{item.duration}</p>
            </div>

            <div className="flex items-center gap-3">
              {item.isEmpty ? (
                <div className="h-10 w-10 rounded-full border border-dashed border-[#D0D5DD]" />
              ) : (
                <div className="h-10 w-10 overflow-hidden rounded-full bg-[#E5E7EB]">
                  <Image src={item.avatar} alt={item.name} width={40} height={40} className="h-full w-full object-cover" />
                </div>
              )}

              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${item.status === "Confirmed" ? "text-white" : "text-[#101828]"}`}>{item.name}</p>
                <p className={`truncate text-xs ${item.status === "Confirmed" ? "text-white/80" : "text-[#667085]"}`}>{item.type}</p>
                {item.meta.length ? (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {item.meta.map((metaItem) => (
                      <span key={metaItem} className={`text-[11px] ${item.status === "Confirmed" ? "text-white/80" : "text-[#8A6A33]"}`}>
                        #{metaItem}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <span className={`text-xs font-medium ${statusTone(item.status)}`}>{item.status}</span>
              <div className="flex items-center gap-2">
                {item.isEmpty ? (
                  <button type="button" className={`rounded-[8px] px-3 py-1.5 text-xs font-medium ${actionButtonTone(item)}`}>
                    {item.action}
                  </button>
                ) : item.status === "Pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onBookingDecision?.(item, true);
                      }}
                      className="text-[#0A4833] transition hover:text-[#083727]"
                      aria-label={`Approve ${item.name}`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onBookingDecision?.(item, false);
                      }}
                      className="text-[#98A2B3] transition hover:text-[#667085]"
                      aria-label={`Reject ${item.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className={`${item.status === "Confirmed" ? "text-white hover:text-white/80" : "text-[#0A4833] hover:text-[#083727]"} transition`}>
                      {item.action === "Approve" ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenDetails(item);
                      }}
                      className={`${item.status === "Confirmed" ? "text-white/80 hover:text-white" : "text-[#667085] hover:text-[#0A4833]"} transition`}
                      aria-label={`View details for ${item.name}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

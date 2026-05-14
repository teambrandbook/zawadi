"use client";

import { CalendarDays, Video } from "lucide-react";

type Session = {
  id: string;
  doctor: string;
  specialty: string;
  dateLabel: string;
  timeLabel: string;
  mode: "Video Call" | "Phone Call";
  status: "scheduled" | "pending" | "confirmed" | "completed" | "cancelled";
  meetingLink?: string;
};

type Props = {
  sessions: Session[];
  onJoin: (id: string) => void;
  onReschedule: (id: string) => void;
};

function getStatusLabel(status: Session["status"]) {
  if (status === "confirmed") return "Confirmed";
  if (status === "completed") return "Completed";
  if (status === "pending") return "Pending";
  if (status === "cancelled") return "Cancelled";
  return "Scheduled";
}

function getStatusTone(status: Session["status"]) {
  if (status === "cancelled") return "bg-[#FEF2F2] text-[#B42318]";
  if (status === "pending") return "bg-[#F8F3E9] text-[#A88751]";
  if (status === "confirmed") return "bg-[#ECFDF3] text-[#027A48]";
  if (status === "completed") return "bg-[#F2F4F7] text-[#344054]";
  return "bg-[#F2F4F7] text-[#667085]";
}

export default function UpcomingSessions({ sessions, onJoin, onReschedule }: Props) {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h3 className="text-lg font-semibold text-[#0A4833]">Upcoming Sessions</h3>

      <div className="mt-3 space-y-4">
        {sessions.length === 0 && (
          <div className="rounded-[14px] border border-dashed border-[#D0D5DD] px-5 py-8 text-center">
            <p className="text-[15px] font-semibold text-[#0A4833]">No sessions found</p>
            <p className="mt-1 text-[14px] text-[#667085]">Your booked consultations will appear here.</p>
          </div>
        )}

        {sessions.map((session) => (
          <article key={session.id} className="rounded-[18px] border border-[#E4E7EC] bg-white px-5 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-[18px] font-semibold text-[#1F2937]">{session.doctor}</p>
                  <p className="mt-1 text-[14px] text-[#667085]">{session.specialty}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#4B5563]">
                  <span>{`${session.dateLabel}, ${session.timeLabel}`}</span>
                  <CalendarDays className="h-3.5 w-3.5 text-[#667085]" />
                  <div className="basis-full" />
                  {session.meetingLink ? (
                    <button
                      type="button"
                      onClick={() => onJoin(session.id)}
                      className="max-w-[260px] truncate rounded-[6px] bg-[#F2F4F7] px-3 py-2 text-left text-[12px] text-[#475467] hover:bg-[#E4E7EC]"
                      title={session.meetingLink}
                    >
                      {session.meetingLink}
                    </button>
                  ) : null}
                  <span className="inline-flex rounded-[4px] bg-[#0C5C43] px-3 py-2 text-[12px] font-medium text-white">
                    {session.mode}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                {session.meetingLink && session.status !== "cancelled" && (
                  <>
                    <button
                      type="button"
                      onClick={() => onJoin(session.id)}
                      className="inline-flex h-11 items-center justify-center rounded-[12px] bg-[#0C5C43] px-6 text-[14px] font-medium text-white hover:bg-[#094734]"
                    >
                      <Video className="mr-2 h-4 w-4 fill-current" />
                      Join Session
                    </button>
                    <button
                      type="button"
                      onClick={() => onReschedule(session.id)}
                      className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#D0D5DD] bg-white px-6 text-[14px] font-medium text-[#111827] hover:bg-[#F9FAFB]"
                    >
                      Reschedule
                    </button>
                  </>
                )}

                {session.status === "confirmed" && !session.meetingLink && (
                  <span className={`inline-flex h-11 items-center rounded-[12px] px-6 text-[14px] font-medium ${getStatusTone(session.status)}`}>
                    {getStatusLabel(session.status)}
                  </span>
                )}

                {session.status === "cancelled" && (
                  <>
                    <span className={`inline-flex h-11 items-center rounded-[12px] px-6 text-[14px] font-medium ${getStatusTone(session.status)}`}>
                      {getStatusLabel(session.status)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onReschedule(session.id)}
                      className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#D0D5DD] bg-white px-6 text-[14px] font-medium text-[#111827] hover:bg-[#F9FAFB]"
                    >
                      Reschedule
                    </button>
                  </>
                )}

                {session.status !== "confirmed" && session.status !== "cancelled" && !session.meetingLink && (
                  <span className={`inline-flex h-11 items-center rounded-[12px] px-6 text-[14px] font-medium ${getStatusTone(session.status)}`}>
                    {getStatusLabel(session.status)}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

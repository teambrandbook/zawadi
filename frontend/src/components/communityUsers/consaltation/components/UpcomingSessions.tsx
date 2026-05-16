"use client";

import Image from "next/image";
import { CalendarDays } from "lucide-react";

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
  if (status === "confirmed") return "Scheduled";
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
    <section className="rounded-[10px] border border-[#E1E4E8] bg-white">
      <div className="border-b border-[#E8EAEE] px-6 py-6">
        <h3 className="text-[18px] font-bold text-[#0A4833]">Upcoming Sessions</h3>
      </div>

      <div className="space-y-5 p-6">
        {sessions.length === 0 && (
          <div className="rounded-[14px] border border-dashed border-[#D0D5DD] px-5 py-8 text-center">
            <p className="text-[15px] font-semibold text-[#0A4833]">No sessions found</p>
            <p className="mt-1 text-[14px] text-[#667085]">Your booked consultations will appear here.</p>
          </div>
        )}

        {sessions.map((session, index) => (
          <article key={session.id} className="rounded-[8px] border border-[#E1E4E8] bg-white px-5 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#E5E7EB]">
                  <Image src={`/recipe/recipe-${(index % 4) + 1}.webp`} alt={session.doctor} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#111827]">{session.doctor}</p>
                  <p className="mt-1 text-[13px] text-[#4B5563]">{session.specialty}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[#4B5563]">
                    <span>{`${session.dateLabel}, ${session.timeLabel}`}</span>
                    <CalendarDays className="h-3.5 w-3.5 text-[#4B5563]" />
                    <span className={`inline-flex rounded-[3px] px-2 py-1 text-[11px] font-medium text-white ${session.mode === "Video Call" ? "bg-[#07533D]" : "bg-[#A88751]"}`}>
                      {session.mode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                {session.meetingLink && session.status !== "cancelled" && (
                  <>
                    <button
                      type="button"
                      onClick={() => onJoin(session.id)}
                      className="inline-flex h-10 items-center justify-center rounded-[6px] bg-[#07533D] px-6 text-[13px] font-medium text-white hover:bg-[#063F2F]"
                    >
                      Join Session
                    </button>
                    <button
                      type="button"
                      onClick={() => onReschedule(session.id)}
                      className="inline-flex h-10 items-center justify-center rounded-[6px] border border-[#D0D5DD] bg-white px-5 text-[13px] font-medium text-[#111827] hover:bg-[#F9FAFB]"
                    >
                      Reschedule
                    </button>
                  </>
                )}

                {session.status === "confirmed" && !session.meetingLink && (
                  <>
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-10 items-center justify-center rounded-[6px] bg-[#D1D5DB] px-6 text-[13px] font-medium text-[#6B7280]"
                    >
                      Join Session
                    </button>
                    <span className={`inline-flex h-10 items-center rounded-[6px] px-5 text-[13px] font-medium ${getStatusTone(session.status)}`}>
                      {getStatusLabel(session.status)}
                    </span>
                  </>
                )}

                {session.status === "cancelled" && (
                  <>
                    <span className={`inline-flex h-10 items-center rounded-[6px] px-5 text-[13px] font-medium ${getStatusTone(session.status)}`}>
                      {getStatusLabel(session.status)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onReschedule(session.id)}
                      className="inline-flex h-10 items-center justify-center rounded-[6px] border border-[#D0D5DD] bg-white px-5 text-[13px] font-medium text-[#111827] hover:bg-[#F9FAFB]"
                    >
                      Reschedule
                    </button>
                  </>
                )}

                {session.status !== "confirmed" && session.status !== "cancelled" && !session.meetingLink && (
                  <span className={`inline-flex h-10 items-center rounded-[6px] px-5 text-[13px] font-medium ${getStatusTone(session.status)}`}>
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

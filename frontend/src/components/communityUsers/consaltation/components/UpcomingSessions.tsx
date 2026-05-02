"use client";

import { useState } from "react";

type Session = {
  id: string;
  doctor: string;
  specialty: string;
  datetime: string;
  mode: "Video Call" | "Phone Call";
  status: "upcoming" | "scheduled" | "pending" | "confirmed";
};

type Props = {
  sessions: Session[];
  onJoin: (id: string) => void;
  onReschedule: (id: string) => void;
  onCancel: (id: string) => Promise<void>;
};

export default function UpcomingSessions({ sessions, onJoin, onReschedule, onCancel }: Props) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const isCancellable = (s: Session) =>
    s.status === "upcoming" || s.status === "scheduled" ||
    s.status === "pending" || s.status === "confirmed";

  async function handleConfirmCancel(id: string) {
    setCancellingId(id);
    setErrorId(null);
    try {
      await onCancel(id);
      setConfirmingId(null);
    } catch {
      setErrorId(id);
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h3 className="text-lg font-semibold text-[#0A4833]">Upcoming Sessions</h3>

      <div className="mt-3 space-y-3">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-lg border border-[#E8E8E8] bg-[#FCFCFC] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#0A4833]">{session.doctor}</p>
                <p className="text-xs text-[#6B7280]">{session.specialty}</p>
                <p className="mt-1 text-xs text-[#374151]">{session.datetime}</p>
                <span className="mt-2 inline-flex rounded bg-[#A88751] px-2 py-0.5 text-[10px] font-medium text-white">
                  {session.mode}
                </span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  {session.status === "upcoming" ? (
                    <>
                      <button
                        onClick={() => onJoin(session.id)}
                        className="rounded-md bg-[#0A4833] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#083B2A]"
                      >
                        Join Session
                      </button>
                      <button
                        onClick={() => onReschedule(session.id)}
                        className="rounded-md border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs text-[#4B5563] hover:bg-[#F9FAFB]"
                      >
                        Reschedule
                      </button>
                    </>
                  ) : (
                    <span className="rounded-md bg-[#F3F4F6] px-3 py-1.5 text-xs text-[#6B7280]">Scheduled</span>
                  )}

                  {isCancellable(session) && confirmingId !== session.id && (
                    <button
                      onClick={() => { setConfirmingId(session.id); setErrorId(null); }}
                      className="rounded-md border border-[#FCA5A5] bg-white px-3 py-1.5 text-xs text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {confirmingId === session.id && (
                  <div className="flex items-center gap-2 rounded-md border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-2">
                    <span className="text-xs text-[#DC2626]">Cancel this booking?</span>
                    <button
                      onClick={() => handleConfirmCancel(session.id)}
                      disabled={cancellingId === session.id}
                      className="rounded bg-[#DC2626] px-2 py-1 text-[11px] font-medium text-white hover:bg-[#B91C1C] disabled:opacity-50"
                    >
                      {cancellingId === session.id ? "Cancelling…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => { setConfirmingId(null); setErrorId(null); }}
                      disabled={cancellingId === session.id}
                      className="rounded border border-[#D1D5DB] bg-white px-2 py-1 text-[11px] text-[#4B5563] hover:bg-[#F9FAFB] disabled:opacity-50"
                    >
                      Keep
                    </button>
                  </div>
                )}

                {errorId === session.id && (
                  <p className="text-[11px] text-[#DC2626]">Failed to cancel. Please try again.</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

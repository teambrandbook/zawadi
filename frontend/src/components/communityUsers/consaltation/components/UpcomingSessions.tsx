"use client";

type Session = {
  id: string;
  doctor: string;
  specialty: string;
  datetime: string;
  mode: "Video Call" | "Phone Call";
  status: "upcoming" | "scheduled";
};

type Props = {
  sessions: Session[];
  onJoin: (id: string) => void;
  onReschedule: (id: string) => void;
};

export default function UpcomingSessions({ sessions, onJoin, onReschedule }: Props) {
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
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

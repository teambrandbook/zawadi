import { useEffect, useState } from "react";
import { Send, Video } from "lucide-react";
import type { ScheduleItem } from "./appointmentsData";
import ScheduleAvatar from "./ScheduleAvatar";

type Props = {
  appointment?: ScheduleItem | null;
  onJoin?: (appointment: ScheduleItem) => void;
  onShareLink?: (appointment: ScheduleItem, meetingLink: string) => Promise<void> | void;
};

function parseDurationMinutes(value: string) {
  const match = value.match(/(\d+)/);
  return match ? Number(match[1]) : 30;
}

function formatSessionRange(time: string, duration: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return `${time} - ${duration}`;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const suffix = match[3].toUpperCase();
  const startHour = suffix === "PM" && hour !== 12 ? hour + 12 : suffix === "AM" && hour === 12 ? 0 : hour;
  const start = new Date(2000, 0, 1, startHour, minute);
  const end = new Date(start);
  end.setMinutes(start.getMinutes() + parseDurationMinutes(duration));
  const options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true };

  return `${start.toLocaleTimeString("en-US", options)} - ${end.toLocaleTimeString("en-US", options)}`;
}

function getStartingInLabel(appointment: ScheduleItem) {
  if (!appointment.rawDate) return appointment.time;

  const match = appointment.time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return appointment.time;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const suffix = match[3].toUpperCase();
  const twentyFourHour = suffix === "PM" && hour !== 12 ? hour + 12 : suffix === "AM" && hour === 12 ? 0 : hour;
  const start = new Date(`${appointment.rawDate}T${String(twentyFourHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
  const diffMinutes = Math.round((start.getTime() - Date.now()) / 60000);

  if (Number.isNaN(diffMinutes)) return appointment.time;
  if (diffMinutes < -5) return "Started";
  if (diffMinutes <= 0) return "Starting now";
  if (diffMinutes < 60) return `${diffMinutes} minutes`;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours < 24) return minutes ? `${hours}h ${minutes}m` : `${hours} hours`;

  const days = Math.floor(hours / 24);
  return days === 1 ? "Tomorrow" : `${days} days`;
}

export default function NextAppointmentCard({ appointment, onJoin, onShareLink }: Props) {
  const [meetingLink, setMeetingLink] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    setMeetingLink(appointment?.meetingLink ?? "");
    setShareMessage("");
  }, [appointment?.id, appointment?.meetingLink]);

  if (!appointment || appointment.isEmpty) {
    return (
      <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.04)]">
        <h2 className="text-base font-semibold text-[#0A4833]">Next Appointment</h2>
        <p className="mt-5 text-sm text-[#667085]">No upcoming appointments scheduled yet.</p>
      </section>
    );
  }

  async function handleShareLink() {
    if (!appointment || !meetingLink.trim()) return;
    setIsSharing(true);
    setShareMessage("");
    try {
      await onShareLink?.(appointment, meetingLink.trim());
      setShareMessage("Link shared with community user.");
    } catch (error) {
      const detail =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : null;
      setShareMessage(detail || "Unable to share link. Please login as the assigned consultant and try again.");
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <section className="rounded-[16px] border border-[#E4E7EC] bg-white p-5 shadow-[0_8px_24px_rgba(16,24,40,0.04)]">
      <h2 className="text-lg font-semibold text-[#0A4833]">Next Appointment</h2>

      <div className="mt-4 flex items-center gap-3">
        <ScheduleAvatar src={appointment.avatar} name={appointment.name} size={48} className="h-12 w-12 text-sm" />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold leading-tight text-[#101828]">{appointment.name}</p>
          <p className="mt-0.5 truncate text-sm leading-tight text-[#667085]">{appointment.type}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[10px] bg-[#EDE2CE] p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-[#475467]">Starting in</p>
          <p className="text-sm font-semibold text-[#0A4833]">{getStartingInLabel(appointment)}</p>
        </div>
        <p className="mt-3 text-lg font-semibold leading-tight text-[#0A4833]">
          {formatSessionRange(appointment.time, appointment.duration)}
        </p>
      </div>

      <label className="mt-3 block text-sm font-medium text-[#0A4833]" htmlFor="appointment-link">
        Add Link
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="appointment-link"
          type="text"
          value={meetingLink}
          onChange={(event) => setMeetingLink(event.target.value)}
          placeholder="Add Link"
          className="h-11 min-w-0 flex-1 rounded-[10px] border border-[#D0D5DD] bg-white px-3 text-sm text-[#101828] outline-none transition placeholder:text-[#101828] focus:border-[#0A4833]"
        />
        <button
          type="button"
          onClick={handleShareLink}
          disabled={isSharing || !meetingLink.trim()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#0A4833] text-white transition hover:bg-[#083727]"
          aria-label="Send appointment link"
        >
          <Send className="h-5 w-5 fill-current" />
        </button>
      </div>
      {shareMessage ? (
        <p
          className={`mt-2 text-xs ${
            shareMessage.startsWith("Link shared") ? "text-[#027A48]" : "text-[#B42318]"
          }`}
        >
          {shareMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => onJoin?.(appointment)}
        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#0A4833] text-sm font-medium text-white transition hover:bg-[#083727]"
      >
        <Video className="h-4 w-4 fill-current" />
        <span>Join Session</span>
      </button>
    </section>
  );
}

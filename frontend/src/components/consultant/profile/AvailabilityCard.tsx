import { CalendarDays, Check, ChevronDown, Clock3 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { AvailabilityConfig, AvailabilitySlot } from "./profileTypes";

type Props = {
  settings: AvailabilityConfig;
  slots: AvailabilitySlot[];
  sessionDuration?: string;
  onSessionDurationChange?: (value: string) => void;
};

function TimeField({ value, muted = false }: { value: string; muted?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-10 items-center justify-between rounded-[8px] border px-3 text-sm",
        muted
          ? "border-[#ECE7DE] bg-[#F9F7F3] text-[#B7AEA0]"
          : "border-[#F0ECE5] bg-white text-[#111827]",
      )}
    >
      <span>{value}</span>
      <Clock3 className={cn("h-4 w-4", muted ? "text-[#C7BFB1]" : "text-[#111827]")} />
    </div>
  );
}

export default function AvailabilityCard({ settings, slots, sessionDuration, onSessionDurationChange }: Props) {
  return (
    <section className="rounded-[12px] border border-[#E7E5E4] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
      <div className="flex items-center gap-2 text-[#0A4833]">
        <CalendarDays className="h-4 w-4 text-[#A38355]" />
        <h2 className="text-lg font-semibold tracking-[-0.5px]">Weekly Availability</h2>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <article>
          <p className="text-xs font-medium text-[#4B5563]">Consultation Duration</p>
          {onSessionDurationChange ? (
            <input
              type="number"
              min="1"
              value={sessionDuration ?? ""}
              onChange={(event) => onSessionDurationChange(event.target.value)}
              className="mt-2 h-11 w-full rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 text-[15px] text-[#111827] outline-none transition focus:border-[#A38355] focus:ring-2 focus:ring-[#EBE1CF]"
            />
          ) : (
            <div className="mt-2 flex h-11 items-center justify-between rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 text-[15px] text-[#111827]">
              <span>{settings.consultationDuration}</span>
              <ChevronDown className="h-4 w-4 text-[#111827]" />
            </div>
          )}
        </article>

        <article>
          <p className="text-xs font-medium text-[#4B5563]">Time Zone</p>
          <div className="mt-2 flex h-11 items-center justify-between rounded-[8px] border border-[#F0ECE5] bg-[#FEFDFC] px-4 text-[15px] text-[#111827]">
            <span>{settings.timeZone}</span>
            <ChevronDown className="h-4 w-4 text-[#111827]" />
          </div>
        </article>
      </div>

      <div className="mt-5 space-y-3">
        {slots.map((slot) => {
          const muted = !slot.enabled;

          return (
            <article
              key={slot.day}
              className={cn(
                "grid gap-4 rounded-[10px] border px-4 py-4 lg:grid-cols-[1.1fr_minmax(0,210px)] lg:items-center",
                muted ? "border-[#F0ECE5] bg-[#FBFAF7] opacity-60" : "border-[#F0ECE5] bg-[#FFFEFC]",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-[2px] border",
                    muted ? "border-[#CFC9BD] bg-white" : "border-[#1677FF] bg-[#1677FF]",
                  )}
                >
                  {slot.enabled ? <Check className="h-3 w-3 text-white" strokeWidth={3} /> : null}
                </span>
                <p className="text-[15px] font-medium text-[#111827]">{slot.day}</p>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                <TimeField value={slot.enabled ? slot.startTime : "--:-- --"} muted={muted} />
                <span className="text-sm text-[#6B7280]">to</span>
                <TimeField value={slot.enabled ? slot.endTime : "--:-- --"} muted={muted} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

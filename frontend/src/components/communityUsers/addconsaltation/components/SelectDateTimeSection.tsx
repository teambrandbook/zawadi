"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

type Props = {
  expertName: string;
  selectedDate: string;
  selectedSlot: string;
  sessionType: string;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toIsoDate(value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function getTodayIsoDate() {
  return toIsoDate(startOfDay(new Date()));
}

function parseIsoDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function formatSlotLabel(hour: number, minute: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${pad(displayHour)}:${pad(minute)} ${suffix}`;
}

function createAvailableSlots() {
  const slots: string[] = [];

  for (let hour = 9; hour <= 17; hour += 1) {
    for (const minute of [0, 30]) {
      if (hour === 17 && minute === 30) continue;
      slots.push(formatSlotLabel(hour, minute));
    }
  }

  return slots;
}

const availableSlots = createAvailableSlots();

function getSessionDuration(sessionType: string) {
  if (sessionType === "Audio Call") return "30 minutes";
  if (sessionType === "Chat Session") return "60 minutes";
  return "60 minutes";
}

function formatDisplayDate(value: string) {
  if (!value) return "Not selected";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function SelectDateTimeSection({
  expertName,
  selectedDate,
  selectedSlot,
  sessionType,
  onSelectDate,
  onSelectSlot,
  onContinue,
  onBack,
}: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const parsedSelectedDate = useMemo(() => parseIsoDate(selectedDate), [selectedDate]);
  const initialVisibleMonth = parsedSelectedDate && parsedSelectedDate >= today ? parsedSelectedDate : today;
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initialVisibleMonth.getFullYear(), initialVisibleMonth.getMonth(), 1),
  );

  const selectedDay = Number(selectedDate.split("-")[2] ?? 0);
  const firstDayOffset = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const visibleMonthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const todayIsoDate = getTodayIsoDate();

    if (!parsedSelectedDate || parsedSelectedDate < today) {
      onSelectDate(todayIsoDate);
    }

    if (!selectedSlot || !availableSlots.includes(selectedSlot)) {
      onSelectSlot(availableSlots[0]);
    }
  }, [onSelectDate, onSelectSlot, parsedSelectedDate, selectedSlot, today]);

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-[#DFDFDF] bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-[#0A4833]">Select Date</h3>
              <div className="inline-flex items-center gap-3 text-[#4B5563]">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleMonth(
                      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                    )
                  }
                  disabled={
                    visibleMonth.getFullYear() === today.getFullYear() &&
                    visibleMonth.getMonth() === today.getMonth()
                  }
                  className="rounded-md p-1 hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:text-[#D1D5DB]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-[#0A4833]">{visibleMonthLabel}</span>
                <button
                  type="button"
                  onClick={() =>
                    setVisibleMonth(
                      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
                    )
                  }
                  className="rounded-md p-1 hover:bg-[#F3F4F6]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-3 text-center text-xs">
              {weekdays.map((day) => (
                <span key={day} className="font-medium text-[#6B7280]">
                  {day}
                </span>
              ))}

              {Array.from({ length: firstDayOffset }).map((_, index) => (
                <span key={`offset-${index}`} />
              ))}

              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const dateValue = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
                const dateIso = toIsoDate(dateValue);
                const isPastDate = startOfDay(dateValue) < today;
                const active = selectedDay === day && selectedDate === dateIso;

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={isPastDate}
                    onClick={() => onSelectDate(dateIso)}
                    className={`mx-auto h-8 w-10 rounded-md text-sm ${
                      isPastDate
                        ? "cursor-not-allowed text-[#B8BDC4]"
                        : active
                        ? "bg-[#A88751] text-white"
                        : "text-[#0A4833] hover:bg-[#F4F5F6]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-[#DFDFDF] bg-white p-4">
            <h3 className="text-2xl font-semibold text-[#0A4833]">
              Available Times - {formatDisplayDate(selectedDate)}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`h-10 rounded-lg border text-sm ${
                    selectedSlot === slot
                        ? "border-[#A88751] bg-[#A88751] text-white"
                        : "border-[#DFDFDF] bg-white text-[#374151] hover:bg-[#F9FAFB]"
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-max rounded-lg border border-[#DFDFDF] bg-white p-4">
          <h3 className="text-2xl font-semibold text-[#0A4833]">Booking Summary</h3>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Expert</span>
              <span className="font-medium text-[#0A4833]">{expertName}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Date</span>
              <span className="font-medium text-[#0A4833]">{formatDisplayDate(selectedDate)}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Time</span>
              <span className="font-medium text-[#0A4833]">{selectedSlot || "Not selected"}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Session Type</span>
              <span className="font-medium text-[#0A4833]">{sessionType || "Video Call"}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Duration</span>
              <span className="font-medium text-[#0A4833]">{getSessionDuration(sessionType)}</span>
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-[#F8F3E9] p-3 text-xs text-[#6B7280]">
            <p className="inline-flex items-center gap-1 font-medium text-[#8B6A3A]">
              <Info className="h-3.5 w-3.5" />
              Session Details
            </p>
            <p className="mt-1">
              You&apos;ll receive a confirmation email with video call details 24 hours before your appointment.
            </p>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-[#0A4833] text-sm font-medium text-white hover:bg-[#083B2A]"
          >
            Continue to Health Details
          </button>
          <button
            type="button"
            onClick={onBack}
            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md border border-[#DFDFDF] bg-white text-sm text-[#4B5563]"
          >
            Back
          </button>
        </aside>
      </div>
    </section>
  );
}

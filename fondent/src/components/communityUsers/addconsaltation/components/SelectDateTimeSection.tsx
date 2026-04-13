"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

type Props = {
  expertName: string;
  expertRole: string;
  selectedDate: string;
  selectedSlot: string;
  sessionType: string;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onSaveForLater: () => void;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const firstDayOffset = 0;
const daysInMonth = 31;

const availableSlots = [
  { label: "09:00 AM", disabled: false },
  { label: "11:30 AM", disabled: false },
  { label: "02:00 PM", disabled: false },
  { label: "04:30 PM", disabled: false },
  { label: "06:00 PM", disabled: false },
  { label: "07:30 PM", disabled: true },
];

function formatDate(day: number) {
  return `Dec ${day}, 2024`;
}

function getSessionDuration(sessionType: string) {
  if (sessionType === "Audio Call") return "30 minutes";
  if (sessionType === "Chat Session") return "60 minutes";
  return "60 minutes";
}

export default function SelectDateTimeSection({
  expertName,
  expertRole,
  selectedDate,
  selectedSlot,
  sessionType,
  onSelectDate,
  onSelectSlot,
  onContinue,
  onBack,
  onSaveForLater,
}: Props) {
  const selectedDay = Number(selectedDate.match(/\b(\d{1,2})\b/)?.[1] ?? 0);

  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-[#DFDFDF] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#DFDFDF]">
                <Image src="/recipe/recipe-2.webp" alt={expertName} fill className="object-cover" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#0A4833]">{expertName}</p>
                <p className="text-sm text-[#A88751]">{expertRole}</p>
                <p className="text-xs text-[#6B7280]">60-minute consultation • {sessionType || "Video Call"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#DFDFDF] bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-[#0A4833]">Select Date</h3>
              <div className="inline-flex items-center gap-3 text-[#4B5563]">
                <button className="rounded-md p-1 hover:bg-[#F3F4F6]">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-[#0A4833]">December 2024</span>
                <button className="rounded-md p-1 hover:bg-[#F3F4F6]">
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
                const active = selectedDay === day;
                const faded = day >= 22 && day <= 25;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => onSelectDate(formatDate(day))}
                    className={`mx-auto h-8 w-10 rounded-md text-sm ${
                      active
                        ? "bg-[#A88751] text-white"
                        : faded
                          ? "text-[#B8BDC4]"
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
              Available Times - {selectedDate || "December 12"}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {availableSlots.map((slot) => (
                <button
                  key={slot.label}
                  type="button"
                  disabled={slot.disabled}
                  onClick={() => onSelectSlot(slot.label)}
                  className={`h-10 rounded-lg border text-sm ${
                    slot.disabled
                      ? "cursor-not-allowed border-[#E5E7EB] bg-[#E5E7EB] text-[#9CA3AF]"
                      : selectedSlot === slot.label
                        ? "border-[#A88751] bg-[#A88751] text-white"
                        : "border-[#DFDFDF] bg-white text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-[#DFDFDF] bg-white p-4">
          <h3 className="text-2xl font-semibold text-[#0A4833]">Booking Summary</h3>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Expert</span>
              <span className="font-medium text-[#0A4833]">{expertName}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Date</span>
              <span className="font-medium text-[#0A4833]">{selectedDate || "Not selected"}</span>
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
          <button
            type="button"
            onClick={onSaveForLater}
            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-white text-sm text-[#A88751]"
          >
            Save for Later
          </button>
        </aside>
      </div>
    </section>
  );
}

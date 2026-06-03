"use client";

import type { ClipboardEvent, KeyboardEvent } from "react";
import { useRef } from "react";
import { ArrowLeft, CalendarCheck2, Check, CheckCircle2, Edit3, Shield, Star } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

type Expert = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: string;
};

type HealthDetails = {
  primaryWellnessGoal: string;
  mainConcern: string;
  dietPreferences: string[];
  allergies: string;
  lifestyle: string;
  buckwheatGoals: string;
  additionalMessage: string;
};

type ConsultationFormData = {
  choose_section: string;
  primary_goal: string;
  language: string;
  date: string;
  time: string;
  primary_wellness_goal: string;
  focus_area: string;
  allergies: string;
  diet_restriction: string;
  lifestyle_activity: string;
  journey_goal: string;
  additional_message: string;
};

type MatchedConsultant = {
  consultant_id: string | number;
  consultant_name: string;
  photo: string | null;
  qualification: string | null;
  consultation_fee?: number | null;
};

type Props = {
  selectedExpert: Expert | null;
  matchedConsultant: MatchedConsultant | null;
  selectedDate: string;
  selectedSlot: string;
  sessionType: string;
  selectedGoal: string;
  selectedLanguage: string;
  healthDetails: HealthDetails;
  formData: ConsultationFormData;
  isAgreed: boolean;
  onToggleAgreement: () => void;
  otpCode: string;
  onOtpChange: (value: string) => void;
  onResendOtp: () => void;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
};

const OTP_LENGTH = 6;

function formatLabel(value: string) {
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  if (!value) return value;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return value;

  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${suffix}`;
}

function getDuration(sessionType: string) {
  if (sessionType === "Audio Call") return "30 minutes";
  if (sessionType === "Chat Session") return "60 minutes";
  return "45 minutes";
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#EBE1CF] p-4">
      <p className="text-sm text-[#4B5563]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#0A4833]">{value}</p>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-[#4B5563]">{label}</p>
      <p className="mt-1 text-sm font-medium leading-6 text-[#0A4833]">{value}</p>
    </div>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[#4B5563]">{label}</span>
      <span className="max-w-[160px] text-right font-medium text-[#0A4833]">{value}</span>
    </div>
  );
}

export default function ConfirmBookingSection({
  selectedExpert,
  matchedConsultant,
  selectedDate,
  selectedSlot,
  sessionType,
  selectedGoal,
  selectedLanguage,
  healthDetails,
  formData,
  isAgreed,
  onToggleAgreement,
  otpCode,
  onOtpChange,
  onResendOtp,
  onConfirm,
  onBack,
  isSubmitting,
}: Props) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const expertName = matchedConsultant?.consultant_name || selectedExpert?.name || "Dr. Emma Thompson";
  const expertSpecialty = matchedConsultant?.qualification || selectedExpert?.specialty || "Certified Nutritionist";
  const displayDate = formatDate(selectedDate || formData.date);
  const displayTime = formatTime(selectedSlot || formData.time);
  const duration = getDuration(sessionType);
  const focusArea = formData.focus_area || healthDetails.mainConcern || "belly";
  const wellnessGoal = formData.primary_wellness_goal || healthDetails.primaryWellnessGoal || "fitness";
  const expertPhoto = matchedConsultant?.photo ? getImageUrl(matchedConsultant.photo) : null;
  const otpDigits = Array.from({ length: OTP_LENGTH }, (_, index) => otpCode[index] || "");

  function focusInput(index: number) {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  }

  function setDigit(index: number, value: string) {
    const digits = otpDigits;
    digits[index] = value;
    onOtpChange(digits.join("").slice(0, OTP_LENGTH));
  }

  function handleOtpChange(index: number, value: string) {
    const sanitized = value.replace(/\D/g, "");

    if (!sanitized) {
      setDigit(index, "");
      return;
    }

    if (sanitized.length > 1) {
      const digits = [...otpDigits];
      sanitized.slice(0, OTP_LENGTH - index).split("").forEach((digit, offset) => {
        digits[index + offset] = digit;
      });
      onOtpChange(digits.join("").slice(0, OTP_LENGTH));
      focusInput(Math.min(index + sanitized.length, OTP_LENGTH - 1));
      return;
    }

    setDigit(index, sanitized);
    if (index < OTP_LENGTH - 1) focusInput(index + 1);
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      setDigit(index - 1, "");
      focusInput(index - 1);
    }

    if (event.key === "ArrowLeft" && index > 0) focusInput(index - 1);
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) focusInput(index + 1);
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    onOtpChange(pasted);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.5px] text-[#0A4833]">Confirm Booking</h1>
        <p className="mt-3 text-base text-[#4B5563]">
          Review your consultation details before confirming your session.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,715px)_341px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-[-0.5px] text-[#0A4833]">Consultation Summary</h2>

            <div className="mt-6 flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EBE1CF]">
                {expertPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={expertPhoto} alt={expertName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold text-[#0A4833]">{expertName.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0A4833]">{expertName}</h3>
                <p className="mt-1 font-medium text-[#9F8151]">{expertSpecialty}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-[#4B5563]">
                  <Star className="h-4 w-4 fill-[#9F8151] text-[#9F8151]" /> {selectedExpert?.rating || "4.9"} (127 reviews)
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-[#16A34A]">
                  <span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Available for consultation
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SummaryTile label="Session Type" value={sessionType || "Video Call"} />
              <SummaryTile label="Duration" value={duration} />
              <SummaryTile label="Date" value={displayDate} />
              <SummaryTile label="Time" value={`${displayTime} - ${duration}`} />
            </div>
          </section>

          <section className="rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-[-0.5px] text-[#0A4833]">Health Details Review</h2>
              <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-medium text-[#9F8151]">
                <Edit3 className="h-3.5 w-3.5" /> Edit Details
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <ReviewItem label="Wellness Goal" value={formatLabel(wellnessGoal)} />
              <ReviewItem label="Consultation Reason" value={formData.journey_goal || "lose 5kg"} />
              <ReviewItem label="Diet Preference" value={formatLabel(formData.diet_restriction || "vegetarian")} />
              <ReviewItem label="Allergies & Restrictions" value={formData.allergies || "peanuts"} />
              <ReviewItem label="Lifestyle & Activity" value={formatLabel(formData.lifestyle_activity || "moderate")} />
              <ReviewItem label="Focus Area" value={formatLabel(focusArea)} />
              <ReviewItem label="Additional Notes" value={formData.additional_message || "Need help"} />
            </div>
          </section>

          <section className="rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-[-0.5px] text-[#0A4833]">Session Overview</h2>
            <div className="mt-6 rounded-lg bg-[#EBE1CF] p-4">
              <h3 className="font-medium text-[#0A4833]">What to Expect</h3>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-[#4B5563]">
                <li>Personalized nutrition assessment</li>
                <li>Buckwheat integration strategies</li>
                <li>Custom meal planning guidance</li>
                <li>Follow-up recommendations</li>
              </ul>
            </div>
          </section>
        </div>

        <aside className="h-max self-start rounded-xl border border-[#DFDFDF] bg-white p-6 shadow-sm xl:sticky xl:bottom-0">
          <div className="text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#EBE1CF] text-[#9F8151]">
              <CalendarCheck2 className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-lg font-semibold leading-7 text-[#0A4833]">
              Your Expert Session is Almost Booked
            </h3>
            <p className="mt-3 text-sm leading-5 text-[#4B5563]">
              You&apos;ll receive updates and reminders in your dashboard. Get personalized nutrition guidance tailored
              to your health goals.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <SidebarRow label="Expert" value={expertName} />
            <SidebarRow label="Date" value={displayDate} />
            <SidebarRow label="Time" value={displayTime} />
            <SidebarRow label="Goal" value={formatLabel(selectedGoal || formData.primary_goal)} />
            <SidebarRow label="Language" value={formatLabel(selectedLanguage || formData.language)} />
            <SidebarRow label="Session Type" value={sessionType || "Video Call"} />
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-[#0A4833]">Verify your OTP</p>
            <p className="mt-1 text-xs leading-4 text-[#6B7280]">
              A 6-digit code has been sent to your account email. Enter it before confirming.
            </p>
            <div className="mt-3 grid grid-cols-6 gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  onPaste={handleOtpPaste}
                  className="aspect-square h-auto w-full min-w-0 rounded-lg border border-[#DFDFDF] bg-white text-center text-lg font-semibold text-[#0A4833] outline-none transition focus:border-[#0A4833]"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={onResendOtp}
              disabled={isSubmitting}
              className="mt-3 text-xs font-semibold text-[#0A4833] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resend code
            </button>
            <label className="mt-3 flex items-center gap-2 text-xs text-[#4B5563]">
              <input type="checkbox" checked={isAgreed} onChange={onToggleAgreement} className="h-4 w-4 accent-[#0A4833]" />
              I confirm all details are correct.
            </label>
          </div>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={!isAgreed || otpCode.length !== OTP_LENGTH || !matchedConsultant?.consultant_id || isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0A4833] text-base font-medium text-white hover:bg-[#083B2A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check className="h-4 w-4" /> {isSubmitting ? "Booking..." : "Confirm Booking"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#F3F4F6] text-base font-medium text-[#374151]"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>

          <div className="mt-6 border-t border-[#DFDFDF] pt-5">
            <p className="flex gap-2 text-xs leading-4 text-[#6B7280]">
              <Shield className="mt-0.5 h-3 w-3 shrink-0 text-[#9F8151]" />
              Your consultation is protected by our wellness commitment. Cancel or reschedule up to 24 hours before your
              session.
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-[#16A34A]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Payload ready as formData
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export type { ConsultationFormData };

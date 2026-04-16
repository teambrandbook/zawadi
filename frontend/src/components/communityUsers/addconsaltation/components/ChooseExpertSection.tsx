"use client";

import Image from "next/image";
import { MessageCircleMore, PhoneCall, Shield, Users, Video } from "lucide-react";

type SessionType = "Video Call" | "Audio Call" | "Chat Session";

type Props = {
  selectedSessionType: SessionType | "";
  selectedGoal: string;
  selectedLanguage: string;
  onSelectSessionType: (value: SessionType) => void;
  onSelectGoal: (value: string) => void;
  onSelectLanguage: (value: string) => void;
  onUseCredit: () => void;
  onContinue: () => void;
  creditUsed: boolean;
};

const sessionTypes: Array<{ label: SessionType; duration: string; Icon: typeof Video }> = [
  { label: "Video Call", duration: "45 minutes", Icon: Video },
  { label: "Audio Call", duration: "30 minutes", Icon: PhoneCall },
  { label: "Chat Session", duration: "60 minutes", Icon: MessageCircleMore },
];

const goals = [
  "Weight Loss",
  "Energy Improvement",
  "Balanced Nutrition",
  "Digestive Health",
  "Fitness Support",
  "General Wellness",
];

const languages = ["English", "Arabic"];

function SelectCard({
  active,
  title,
  subtitle,
  onClick,
  Icon,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
  Icon: typeof Video;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border p-3 text-center transition-colors ${
        active ? "border-[#A88751] bg-[#F9F6EF]" : "border-[#DFDFDF] bg-white hover:bg-[#FAFAFA]"
      }`}
    >
      <Icon className={`mx-auto h-5 w-5 ${active ? "text-[#A88751]" : "text-[#9CA3AF]"}`} />
      <p className={`mt-2 text-sm font-semibold ${active ? "text-[#0A4833]" : "text-[#374151]"}`}>{title}</p>
      <p className="mt-1 text-xs text-[#6B7280]">{subtitle}</p>
    </button>
  );
}

export default function ChooseExpertSection({
  selectedSessionType,
  selectedGoal,
  selectedLanguage,
  onSelectSessionType,
  onSelectGoal,
  onSelectLanguage,
  onUseCredit,
  onContinue,
  creditUsed,
}: Props) {
  const total = 75;

  return (
    <section className="overflow-hidden rounded-xl border border-[#DFDFDF] bg-white p-4 lg:p-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-[#DFDFDF] bg-white p-4">
            <h3 className="text-xl font-semibold text-[#0A4833]">Choose Session Type</h3>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
              {sessionTypes.map((item) => (
                <SelectCard
                  key={item.label}
                  active={selectedSessionType === item.label}
                  title={item.label}
                  subtitle={item.duration}
                  onClick={() => onSelectSessionType(item.label)}
                  Icon={item.Icon}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#DFDFDF] bg-white p-4">
            <h3 className="text-xl font-semibold text-[#0A4833]">What&apos;s Your Primary Goal?</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => onSelectGoal(goal)}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    selectedGoal === goal
                      ? "border-[#A88751] bg-[#F9F6EF] text-[#0A4833]"
                      : "border-[#DFDFDF] bg-white text-[#6B7280] hover:bg-[#FAFAFA]"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#DFDFDF] bg-white p-4">
            <h3 className="text-xl font-semibold text-[#0A4833]">Choose Your Communication Language</h3>
            <div className="mt-3 grid max-w-md grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onSelectLanguage(lang)}
                  className={`rounded-lg border px-3 py-2 text-xs ${
                    selectedLanguage === lang
                      ? "border-[#A88751] bg-[#F9F6EF] text-[#0A4833]"
                      : "border-[#DFDFDF] bg-white text-[#6B7280] hover:bg-[#FAFAFA]"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-[#DFDFDF] bg-white p-4">
          <h3 className="text-xl font-semibold text-[#0A4833]">Booking Summary</h3>

          <div className="mt-3 rounded-lg bg-[#F7F4ED] p-3">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src="/recipe/recipe-2.webp" alt="Dr Emily Chen" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A4833]">Dr. Emily Chen</p>
                <p className="text-xs text-[#6B7280]">Certified Nutritionist</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Session Type:</span>
              <span className="font-medium text-[#0A4833]">{selectedSessionType || "Not selected"}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Duration:</span>
              <span className="font-medium text-[#0A4833]">
                {selectedSessionType === "Video Call"
                  ? "45 minutes"
                  : selectedSessionType === "Audio Call"
                    ? "30 minutes"
                    : selectedSessionType === "Chat Session"
                      ? "60 minutes"
                      : "--"}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Focus Area:</span>
              <span className="font-medium text-[#0A4833]">{selectedGoal || "Not selected"}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Date & Time:</span>
              <span className="font-medium text-[#6B7280]">Not selected</span>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-md bg-[#F8F3E9] px-3 py-2 text-xs">
            <span className="text-[#8B6A3A]">Monthly Credit: 5min</span>
            <button
              type="button"
              onClick={onUseCredit}
              className={`rounded px-3 py-1 font-medium ${creditUsed ? "bg-[#0A4833] text-white" : "bg-[#A88751] text-white"}`}
            >
              {creditUsed ? "Used" : "Use"}
            </button>
          </div>

          <p className="mt-4 flex items-center justify-between text-lg font-semibold text-[#0A4833]">
            <span>Total:</span>
            <span>${total}</span>
          </p>

          <button
            type="button"
            onClick={onContinue}
            className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-md bg-[#0A4833] text-sm font-medium text-white hover:bg-[#083B2A]"
          >
            Continue to Date & Time
          </button>
          <button
            type="button"
            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md border border-[#D6C7A9] bg-white text-sm text-[#A88751]"
          >
            Save for Later
          </button>

          <div className="mt-4 space-y-1 text-xs text-[#6B7280]">
            <p className="inline-flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-[#A88751]" /> Secure & confidential</p>
            <p className="inline-flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-[#A88751]" /> Personalized guidance</p>
            <p className="inline-flex items-center gap-2"><Users className="h-3.5 w-3.5 text-[#A88751]" /> Community-backed experts</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export type { SessionType };

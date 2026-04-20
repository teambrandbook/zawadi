"use client";

import { useState } from "react";
import {
  BadgeCheck,
  BellRing,
  CalendarDays,
  Clock3,
  Cog,
  Mail,
  Megaphone,
  MessageSquareText,
  Send,
  Smartphone,
  Tag,
  TriangleAlert,
} from "lucide-react";

const notificationTypes = [
  { id: "announcement", label: "Announcement", Icon: Megaphone },
  { id: "reminder", label: "Reminder", Icon: Clock3 },
  { id: "alert", label: "Alert", Icon: TriangleAlert },
  { id: "approval-update", label: "Approval Update", Icon: BadgeCheck },
  { id: "promotional", label: "Promotional", Icon: Tag },
  { id: "system-notice", label: "System Notice", Icon: Cog },
];

const audienceTypes = [
  "All Users",
  "Event Participants",
  "Recipe Contributors",
  "Blog Contributors",
  "New Users",
  "Inactive Users",
  "Consultation Users",
  "Custom Segment",
];

const channels = [
  { id: "in-app", label: "In-App", Icon: BellRing },
  { id: "email", label: "Email", Icon: Mail },
  { id: "sms", label: "SMS", Icon: MessageSquareText },
  { id: "push", label: "Push", Icon: Smartphone },
];

export default function CreateNotificationFormSections() {
  // State to manage multiple selected delivery channels
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["in-app"]);

  const handleToggle = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Basic Information</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Notification Title" placeholder="Enter notification title" />
          <Field label="Subject Line" placeholder="Short subject for email/push" />
          <SelectField label="Priority Level" value="Medium Priority" options={["Medium Priority", "High Priority", "Low Priority"]} />
          <SelectField label="Status" value="Draft" options={["Draft", "Scheduled", "Sent"]} />
        </div>
      </article>

      {/* Notification Type */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Notification Type</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {notificationTypes.map(({ id, label, Icon }, index) => (
            <label key={id} className="block cursor-pointer">
              <input type="radio" name="notification-type" defaultChecked={index === 0} className="peer sr-only" />
              <span className="flex h-16 items-center gap-2 rounded-md border border-[#DFDFDF] bg-white px-3 text-left text-sm text-[#374151] transition peer-checked:border-[#9F8151] peer-checked:bg-[#F8F4EC] peer-checked:text-[#0A4833]">
                <Icon size={15} className="text-current" />
                {label}
              </span>
            </label>
          ))}
        </div>
      </article>

      {/* Message Content */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Message Content</h2>
        <div className="mt-3 space-y-3">
          <TextAreaField label="Preview Text (40-characters)" rows={2} placeholder="Short preview for notification cards" />
          <TextAreaField label="Full Message" rows={5} placeholder="Write your complete notification message here..." />
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="CTA Button Text" placeholder="View Details" />
            <Field label="CTA Destination" placeholder="/dashboard/events" />
          </div>
        </div>
      </article>

      {/* Target Audience */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Target Audience</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {audienceTypes.map((item) => (
            <label key={item} className="inline-flex items-center gap-2 rounded-md border border-[#DFDFDF] bg-white px-3 py-2 text-xs text-[#4B5563] cursor-pointer hover:bg-gray-50">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CFCFCF]" />
              {item}
            </label>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-[#0A4833]">Estimated Recipients: 2,847 users</span>
          <button type="button" className="text-[#9F8151] font-medium">Advanced Targeting</button>
        </div>
      </article>

      {/* Delivery Channels (FIXED SECTION) */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833] mb-3">Delivery Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {channels.map(({ id, label, Icon }) => {
            const isChecked = selectedChannels.includes(id);

            return (
              <div
                key={id}
                onClick={() => handleToggle(id)}
                className={`
                  relative flex flex-col items-center justify-center h-20 cursor-pointer rounded-lg border transition-all duration-200
                  ${isChecked 
                    ? "border-[#9F8151] bg-[#F8F4EC]" 
                    : "border-[#DFDFDF] bg-white hover:border-gray-200"}
                `}
              >
                {/* The Checkbox wrapper */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-[#007AFF] focus:ring-0 focus:ring-offset-0 transition-all"
                  />
                </div>

                {/* The Content */}
                <div className="flex flex-col items-center justify-center pl-4 select-none">
                  <Icon 
                    size={18} 
                    strokeWidth={2.5}
                    className={isChecked ? "text-[#9F8151]" : "text-[#6B7280]"} 
                  />
                  <span className={`text-[11px] mt-1 font-semibold ${isChecked ? "text-[#0A4833]" : "text-[#4B5563]"}`}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </article>

      {/* Scheduling */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Scheduling</h2>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#0A4833]">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="radio" name="schedule-mode" defaultChecked className="h-3.5 w-3.5 border-[#CFCFCF]" />
            <Send size={13} className="text-[#0A4833]" />
            Send Now
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="radio" name="schedule-mode" className="h-3.5 w-3.5 border-[#CFCFCF]" />
            <Clock3 size={13} className="text-[#6B7280]" />
            Schedule for Later
          </label>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <DateField label="Date" />
          <TimeField label="Time" />
          <SelectField label="Timezone" value="UTC+5 (IST)" options={["UTC+5 (IST)", "UTC", "GMT", "EST"]} />
        </div>
      </article>

      {/* Internal Notes */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Internal Notes</h2>
        <div className="mt-3">
          <textarea
            rows={3}
            placeholder="Add internal notes or campaign remarks for admin reference..."
            className="w-full resize-none rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 py-2 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </article>
    </div>
  );
}

// --- Helper Components ---

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833] font-medium">{label}</p>
      <input
        type="text"
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
      />
    </label>
  );
}

function SelectField({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833] font-medium">{label}</p>
      <select className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none">
        <option>{value}</option>
        {options.filter((item) => item !== value).map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, rows, placeholder }: { label: string; rows: number; placeholder: string }) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833] font-medium">{label}</p>
      <textarea
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 py-2 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
      />
    </label>
  );
}

function DateField({ label }: { label: string }) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833] font-medium">{label}</p>
      <div className="relative">
        <input type="date" className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none" />
        <CalendarDays size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
      </div>
    </label>
  );
}

function TimeField({ label }: { label: string }) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833] font-medium">{label}</p>
      <div className="relative">
        <input type="time" className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none" />
        <Clock3 size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
      </div>
    </label>
  );
}
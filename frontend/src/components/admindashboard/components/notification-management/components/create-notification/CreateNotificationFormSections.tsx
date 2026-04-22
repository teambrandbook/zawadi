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
  { id: "SYSTEM", label: "System Notice", Icon: Cog },
  { id: "REMINDER", label: "Reminder", Icon: Clock3 },
  { id: "ALERT", label: "Alert", Icon: TriangleAlert },
  { id: "announcement", label: "Approval Update", Icon: BadgeCheck },
  { id: "PROMOTIONAL", label: "Promotional", Icon: Tag },
  { id: "system-notice", label: "Announcement", Icon: Megaphone },
];

const audienceOptions = [
  { id: "ALL", label: "All Users" },
  { id: "admin", label: "Admins" },
  { id: "consultant", label: "Consultants" },
  { id: "community_user", label: "Community Users" },
  { id: "internal_staff", label: "Internal Staff" },
];

const channels = [
  { id: "in-app", label: "In-App", Icon: BellRing },
  { id: "email", label: "Email", Icon: Mail },
  { id: "sms", label: "SMS", Icon: MessageSquareText },
  { id: "push", label: "Push", Icon: Smartphone },
];

type Props = {
  title?: string;
  onTitleChange?: (v: string) => void;
  body?: string;
  onBodyChange?: (v: string) => void;
  notificationType?: string;
  onTypeChange?: (v: string) => void;
  targetRole?: string;
  onTargetRoleChange?: (v: string) => void;
};

export default function CreateNotificationFormSections({
  title = "",
  onTitleChange,
  body = "",
  onBodyChange,
  notificationType = "SYSTEM",
  onTypeChange,
  targetRole = "ALL",
  onTargetRoleChange,
}: Props) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["in-app"]);

  const handleToggleChannel = (id: string) => {
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
          <label className="block">
            <p className="mb-1 text-[11px] text-[#0A4833] font-medium">Notification Title</p>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange?.(e.target.value)}
              placeholder="Enter notification title"
              className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </label>
          <label className="block">
            <p className="mb-1 text-[11px] text-[#0A4833] font-medium">Subject Line</p>
            <input
              type="text"
              placeholder="Short subject for email/push"
              className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </label>
          <SelectField label="Priority Level" value="Medium Priority" options={["Medium Priority", "High Priority", "Low Priority"]} />
          <SelectField label="Status" value="Draft" options={["Draft", "Scheduled", "Sent"]} />
        </div>
      </article>

      {/* Notification Type */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Notification Type</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {notificationTypes.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onTypeChange?.(id)}
              className={`flex h-16 items-center gap-2 rounded-md border px-3 text-left text-sm transition ${
                notificationType === id
                  ? "border-[#9F8151] bg-[#F8F4EC] text-[#0A4833]"
                  : "border-[#DFDFDF] bg-white text-[#374151]"
              }`}
            >
              <Icon size={15} className="text-current" />
              {label}
            </button>
          ))}
        </div>
      </article>

      {/* Message Content */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Message Content</h2>
        <div className="mt-3 space-y-3">
          <label className="block">
            <p className="mb-1 text-[11px] text-[#0A4833] font-medium">Full Message</p>
            <textarea
              value={body}
              onChange={(e) => onBodyChange?.(e.target.value)}
              rows={5}
              placeholder="Write your complete notification message here..."
              className="w-full resize-none rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 py-2 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </label>
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
          {audienceOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTargetRoleChange?.(item.id)}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition ${
                targetRole === item.id
                  ? "border-[#9F8151] bg-[#F8F4EC] text-[#0A4833]"
                  : "border-[#DFDFDF] bg-white text-[#4B5563] hover:bg-gray-50"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${targetRole === item.id ? "bg-[#9F8151]" : "bg-[#D1D5DB]"}`} />
              {item.label}
            </button>
          ))}
        </div>
      </article>

      {/* Delivery Channels */}
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833] mb-3">Delivery Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {channels.map(({ id, label, Icon }) => {
            const isChecked = selectedChannels.includes(id);
            return (
              <div
                key={id}
                onClick={() => handleToggleChannel(id)}
                className={`relative flex flex-col items-center justify-center h-20 cursor-pointer rounded-lg border transition-all duration-200 ${
                  isChecked ? "border-[#9F8151] bg-[#F8F4EC]" : "border-[#DFDFDF] bg-white hover:border-gray-200"
                }`}
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-[#007AFF] focus:ring-0"
                  />
                </div>
                <div className="flex flex-col items-center justify-center pl-4 select-none">
                  <Icon size={18} strokeWidth={2.5} className={isChecked ? "text-[#9F8151]" : "text-[#6B7280]"} />
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
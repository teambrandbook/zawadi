"use client";

import {
  BellRing,
  CalendarDays,
  Clock3,
  Cog,
  Mail,
  Send,
  Smartphone,
  Tag,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type DeliveryChannel = "in_app" | "email" | "push";
export type ScheduleMode = "now" | "later";

const notificationTypes = [
  { id: "SYSTEM", label: "System Notice", Icon: Cog },
  { id: "REMINDER", label: "Reminder", Icon: Clock3 },
  { id: "ALERT", label: "Alert", Icon: TriangleAlert },
  { id: "PROMOTIONAL", label: "Promotional", Icon: Tag },
];

const audienceOptions = [
  { id: "ALL", label: "All Users" },
  { id: "admin", label: "Admins" },
  { id: "consultant", label: "Consultants" },
  { id: "community_user", label: "Community Users" },
  { id: "internal_staff", label: "Internal Staff" },
];

const channels: Array<{ id: DeliveryChannel; label: string; Icon: LucideIcon }> = [
  { id: "in_app", label: "In-App", Icon: BellRing },
  { id: "email", label: "Email", Icon: Mail },
  { id: "push", label: "Push", Icon: Smartphone },
];

type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  actionUrl: string;
  onActionUrlChange: (value: string) => void;
  notificationType: string;
  onTypeChange: (value: string) => void;
  targetRole: string;
  onTargetRoleChange: (value: string) => void;
  deliveryChannels: DeliveryChannel[];
  onDeliveryChannelsChange: (value: DeliveryChannel[]) => void;
  scheduleMode: ScheduleMode;
  onScheduleModeChange: (value: ScheduleMode) => void;
  scheduleDate: string;
  onScheduleDateChange: (value: string) => void;
  scheduleTime: string;
  onScheduleTimeChange: (value: string) => void;
};

export default function CreateNotificationFormSections({
  title,
  onTitleChange,
  body,
  onBodyChange,
  actionUrl,
  onActionUrlChange,
  notificationType,
  onTypeChange,
  targetRole,
  onTargetRoleChange,
  deliveryChannels,
  onDeliveryChannelsChange,
  scheduleMode,
  onScheduleModeChange,
  scheduleDate,
  onScheduleDateChange,
  scheduleTime,
  onScheduleTimeChange,
}: Props) {
  const handleToggleChannel = (id: DeliveryChannel) => {
    onDeliveryChannelsChange(
      deliveryChannels.includes(id)
        ? deliveryChannels.filter((item) => item !== id)
        : [...deliveryChannels, id]
    );
  };

  return (
    <div className="space-y-6">
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Basic Information</h2>
        <div className="mt-3 space-y-3">
          <label className="block">
            <p className="mb-1 text-[11px] font-medium text-[#0A4833]">Notification Title</p>
            <input
              type="text"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Enter notification title"
              className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </label>
          <label className="block">
            <p className="mb-1 text-[11px] font-medium text-[#0A4833]">Full Message</p>
            <textarea
              value={body}
              onChange={(event) => onBodyChange(event.target.value)}
              rows={5}
              placeholder="Write your complete notification message here..."
              className="w-full resize-none rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 py-2 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </label>
          <label className="block">
            <p className="mb-1 text-[11px] font-medium text-[#0A4833]">Destination Path (Optional)</p>
            <input
              type="text"
              value={actionUrl}
              onChange={(event) => onActionUrlChange(event.target.value)}
              placeholder="/communityDashBoard/notifications"
              className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
            />
          </label>
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Notification Type</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {notificationTypes.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onTypeChange(id)}
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

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Target Audience</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {audienceOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTargetRoleChange(item.id)}
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

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-[#0A4833]">Delivery Channels</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {channels.map(({ id, label, Icon }) => {
            const isChecked = deliveryChannels.includes(id);
            return (
              <button
                type="button"
                key={id}
                onClick={() => handleToggleChannel(id)}
                className={`relative flex h-20 items-center justify-center rounded-lg border transition-all duration-200 ${
                  isChecked ? "border-[#9F8151] bg-[#F8F4EC]" : "border-[#DFDFDF] bg-white hover:border-gray-200"
                }`}
              >
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <span className={`block h-4 w-4 rounded border ${isChecked ? "border-[#9F8151] bg-[#9F8151]" : "border-gray-300"}`} />
                </span>
                <span className="flex flex-col items-center justify-center pl-4">
                  <Icon size={18} strokeWidth={2.5} className={isChecked ? "text-[#9F8151]" : "text-[#6B7280]"} />
                  <span className={`mt-1 text-[11px] font-semibold ${isChecked ? "text-[#0A4833]" : "text-[#4B5563]"}`}>
                    {label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Scheduling</h2>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#0A4833]">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="schedule-mode"
              checked={scheduleMode === "now"}
              onChange={() => onScheduleModeChange("now")}
              className="h-3.5 w-3.5 border-[#CFCFCF]"
            />
            <Send size={13} className="text-[#0A4833]" />
            Send Now
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="schedule-mode"
              checked={scheduleMode === "later"}
              onChange={() => onScheduleModeChange("later")}
              className="h-3.5 w-3.5 border-[#CFCFCF]"
            />
            <Clock3 size={13} className="text-[#6B7280]" />
            Schedule for Later
          </label>
        </div>
        {scheduleMode === "later" ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="block">
              <p className="mb-1 text-[11px] font-medium text-[#0A4833]">Date</p>
              <div className="relative">
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(event) => onScheduleDateChange(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none"
                />
                <CalendarDays size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              </div>
            </label>
            <label className="block">
              <p className="mb-1 text-[11px] font-medium text-[#0A4833]">Time</p>
              <div className="relative">
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(event) => onScheduleTimeChange(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none"
                />
                <Clock3 size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              </div>
            </label>
          </div>
        ) : null}
      </article>
    </div>
  );
}

import { Bell, Clock, HelpCircle, Mail, MessageSquare, Moon, Send, Smartphone } from "lucide-react";
import type { DeliveryChannel, NotificationCategory, QuietHours, ReminderPreferences } from "./settingsTypes";

type Props = {
  categories: NotificationCategory[];
  channels: DeliveryChannel[];
  reminders: ReminderPreferences;
  quietHours: QuietHours;
  onToggleCategory: (id: string) => void;
  onToggleChannel: (id: string) => void;
  onToggleQuietHours: () => void;
  onSave: () => void;
  onReset: () => void;
};

function ToggleButton({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-5 w-10 rounded-full transition ${enabled ? "bg-[#06402B]" : "bg-[#E5E7EB]"}`}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-5" : "left-0.5"}`}
      />
    </button>
  );
}

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  push: Smartphone,
  inapp: Bell,
} as const;

export default function NotificationsPanel({
  categories,
  channels,
  reminders,
  quietHours,
  onToggleCategory,
  onToggleChannel,
  onToggleQuietHours,
  onSave,
  onReset,
}: Props) {
  const activeCount = categories.filter((category) => category.enabled).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
      <div className="space-y-6">
        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
            <Bell className="h-4 w-4 text-[#A88751]" />
            Notification Categories
          </h2>
          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <article
                key={category.id}
                className={`flex items-center justify-between gap-4 rounded-md border p-4 ${
                  category.enabled ? "border-[#DFDFDF] bg-[#F4F1EA]" : "border-[#E5E7EB] bg-white"
                }`}
              >
                <div>
                  <h3 className="text-sm font-semibold text-[#111827]">{category.title}</h3>
                  <p className="mt-1 text-xs text-[#6B7280]">{category.description}</p>
                </div>
                <ToggleButton enabled={category.enabled} onClick={() => onToggleCategory(category.id)} />
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
            <Send className="h-4 w-4 text-[#A88751]" />
            Delivery Channels
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {channels.map((channel) => {
              const Icon = channelIcons[channel.id as keyof typeof channelIcons] ?? Bell;
              return (
                <article key={channel.id} className="rounded-md border border-[#E5E7EB] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <Icon className="mt-0.5 h-4 w-4 text-[#A88751]" />
                      <div>
                        <h3 className="text-sm font-semibold text-[#111827]">{channel.title}</h3>
                        <p className="mt-2 text-xs text-[#6B7280]">{channel.detail}</p>
                      </div>
                    </div>
                    <ToggleButton enabled={channel.enabled} onClick={() => onToggleChannel(channel.id)} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
            <Clock className="h-4 w-4 text-[#A88751]" />
            Reminder Preferences
          </h2>
          <div className="mt-4 space-y-4">
            <label className="block text-xs font-semibold text-[#374151]">
              Event Reminder Timing
              <select className="mt-2 h-11 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-normal outline-none focus:border-[#06402B]">
                <option>{reminders.event}</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-[#374151]">
              Consultation Reminder Timing
              <select className="mt-2 h-11 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-normal outline-none focus:border-[#06402B]">
                <option>{reminders.consultation}</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-[#374151]">
              Order Delivery Reminders
              <select className="mt-2 h-11 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-normal outline-none focus:border-[#06402B]">
                <option>{reminders.orderDelivery}</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="inline-flex items-center gap-2 text-lg font-bold text-[#06402B]">
              <Moon className="h-4 w-4 text-[#A88751]" />
              Quiet Hours
            </h2>
            <ToggleButton enabled={quietHours.enabled} onClick={onToggleQuietHours} />
          </div>
          <p className="mt-4 text-sm font-semibold text-[#374151]">Enable Do Not Disturb</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-xs font-semibold text-[#374151]">
              From
              <input
                type="text"
                value={quietHours.from}
                readOnly
                className="mt-2 h-11 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-normal outline-none"
              />
            </label>
            <label className="block text-xs font-semibold text-[#374151]">
              To
              <input
                type="text"
                value={quietHours.to}
                readOnly
                className="mt-2 h-11 w-full rounded-md border border-[#E5E7EB] bg-white px-3 text-sm font-normal outline-none"
              />
            </label>
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#06402B]">
            <Clock className="h-4 w-4 text-[#A88751]" />
            Summary
          </h2>
          <div className="mt-4 space-y-3 text-xs">
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Active Categories</span>
              <span className="font-semibold text-[#06402B]">{activeCount} of {categories.length}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Email Notifications</span>
              <span className="font-semibold text-[#111827]">{channels.find((item) => item.id === "email")?.enabled ? "On" : "Off"}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Push Notifications</span>
              <span className="font-semibold text-[#111827]">{channels.find((item) => item.id === "push")?.enabled ? "On" : "Off"}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-[#6B7280]">Quiet Hours</span>
              <span className="font-semibold text-[#111827]">10:00 PM - 8:00 AM</span>
            </p>
          </div>
        </section>

        <button type="button" onClick={onSave} className="h-11 w-full rounded-md bg-[#06402B] text-sm font-semibold text-white hover:bg-[#053020]">
          Save Preferences
        </button>
        <button type="button" onClick={onReset} className="h-11 w-full rounded-md border border-[#A88751] bg-white text-sm font-semibold text-[#A88751] hover:bg-[#F8F3E9]">
          Reset to Default
        </button>

        <section className="rounded-lg bg-[#E9DFCC] p-5">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#06402B]">
            <HelpCircle className="h-4 w-4 text-[#A88751]" />
            Need Help?
          </h2>
          <p className="mt-3 text-xs leading-5 text-[#4B5563]">
            Learn more about notification settings and how they affect your ZEWADI experience.
          </p>
          <button type="button" className="mt-4 text-xs font-semibold text-[#06402B]">
            View Help Center
          </button>
        </section>
      </aside>
    </div>
  );
}

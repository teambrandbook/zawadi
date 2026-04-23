import { cn } from "@/utils/cn";
import type { NotificationChannel, NotificationPreferenceSection, NotificationTiming } from "./settingsTypes";

type Props = {
  preferenceSections: NotificationPreferenceSection[];
  channels: NotificationChannel[];
  timing: NotificationTiming;
  onTogglePreference: (preferenceId: string) => void;
  onToggleChannel: (channelId: string) => void;
  onToggleQuietHours: () => void;
  onToggleWeekendQuietHours: () => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
};

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span className={cn("relative inline-flex h-6 w-11 rounded-full transition", enabled ? "bg-[#9F8151]" : "bg-[#E5E7EB]")}>
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition", enabled ? "left-[22px]" : "left-0.5")} />
    </span>
  );
}

export default function NotificationSettingsContent({
  preferenceSections,
  channels,
  timing,
  onTogglePreference,
  onToggleChannel,
  onToggleQuietHours,
  onToggleWeekendQuietHours,
  onStartTimeChange,
  onEndTimeChange,
  onSave,
  onReset,
}: Props) {
  return (
    <div className="space-y-5">
      <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
        <div className="space-y-8">
          {preferenceSections.map((section, index) => (
            <div key={section.id} className={cn(index > 0 && "border-t border-[#DFDFDF] pt-8")}>
              <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">{section.title}</h2>
              <div className="mt-5 space-y-5">
                {section.items.map((item) => (
                  <article key={item.id} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[15px] font-medium text-[#111827]">{item.title}</p>
                      <p className="mt-1 text-sm text-[#6B7280]">{item.description}</p>
                    </div>
                    <button type="button" onClick={() => onTogglePreference(item.id)} aria-pressed={item.enabled} aria-label={item.title}>
                      <Toggle enabled={item.enabled} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          ))}

          <div className="border-t border-[#DFDFDF] pt-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Delivery Preferences</h2>
            <div className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">
              {channels.map((channel) => (
                <article key={channel.id} className="flex items-center justify-between gap-3">
                  <p className="text-[15px] font-medium text-[#111827]">{channel.label}</p>
                  <button type="button" onClick={() => onToggleChannel(channel.id)} aria-pressed={channel.enabled} aria-label={channel.label}>
                    <Toggle enabled={channel.enabled} />
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="border-t border-[#DFDFDF] pt-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Notification Timing</h2>
            <div className="mt-5 space-y-5">
              <article className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[15px] font-medium text-[#111827]">Quiet hours</p>
                  <p className="mt-1 text-sm text-[#6B7280]">Limit notifications during specified hours</p>
                </div>
                <button type="button" onClick={onToggleQuietHours} aria-pressed={timing.quietHoursEnabled} aria-label="Quiet hours">
                  <Toggle enabled={timing.quietHoursEnabled} />
                </button>
              </article>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-xs font-medium text-[#0A4833]">
                  Start time
                  <select
                    value={timing.startTime}
                    onChange={(event) => onStartTimeChange(event.target.value)}
                    className="mt-2 h-11 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F5F5F5] px-3 text-sm text-[#111827] outline-none"
                  >
                    <option>10:00 PM</option>
                    <option>10:30 PM</option>
                    <option>11:00 PM</option>
                  </select>
                </label>

                <label className="text-xs font-medium text-[#0A4833]">
                  End time
                  <select
                    value={timing.endTime}
                    onChange={(event) => onEndTimeChange(event.target.value)}
                    className="mt-2 h-11 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F5F5F5] px-3 text-sm text-[#111827] outline-none"
                  >
                    <option>7:00 AM</option>
                    <option>7:30 AM</option>
                    <option>8:00 AM</option>
                  </select>
                </label>
              </div>

              <article className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[15px] font-medium text-[#111827]">Do not disturb on weekends</p>
                </div>
                <button
                  type="button"
                  onClick={onToggleWeekendQuietHours}
                  aria-pressed={timing.weekendDoNotDisturb}
                  aria-label="Do not disturb on weekends"
                >
                  <Toggle enabled={timing.weekendDoNotDisturb} />
                </button>
              </article>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-[50px] items-center justify-center rounded-[8px] bg-[#9F8151] px-6 text-sm font-medium text-white transition hover:bg-[#8C7247]"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-[50px] items-center justify-center rounded-[8px] border border-[#DFDFDF] bg-white px-6 text-sm font-medium text-[#0A4833] transition hover:bg-[#FAFAF8]"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { CalendarDays, Loader2, Trash2 } from "lucide-react";
import api from "@/services/api";
import AvailabilitySuggestionCard from "./AvailabilitySuggestionCard";
import UpdateAvailabilityHeader from "./UpdateAvailabilityHeader";

type WeekDayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type DayAvailabilityForm = {
  day: WeekDayKey;
  label: string;
  enabled: boolean;
  start_time: string;
  end_time: string;
};

type ConsultantSettingsForm = {
  accept_new: boolean;
  allow_same_day: boolean;
  show_profile: boolean;
  auto_close_full_day: boolean;
  followup_priority: boolean;
};

type BlockedDateItem = {
  id: number;
  from_date: string;
  to_date: string;
  reason: string;
};

type BlockedDateForm = {
  from_date: string;
  to_date: string;
  reason: string;
};

type ApiErrorResponse = {
  detail?: string;
  error?: string;
  message?: string;
  non_field_errors?: string[];
};

type AvailabilityItem = {
  day: WeekDayKey;
  start_time: string;
  end_time: string;
};

const WEEK_DAYS: Array<{ key: WeekDayKey; label: string }> = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const DEFAULT_SETTINGS: ConsultantSettingsForm = {
  accept_new: true,
  allow_same_day: true,
  show_profile: true,
  auto_close_full_day: true,
  followup_priority: false,
};

const DEFAULT_BLOCKED_FORM: BlockedDateForm = {
  from_date: "",
  to_date: "",
  reason: "",
};

function createEmptyWeek(): DayAvailabilityForm[] {
  return WEEK_DAYS.map((day, index) => ({
    day: day.key,
    label: day.label,
    enabled: index < 5,
    start_time: "09:00",
    end_time: "17:00",
  }));
}

function getMinutesBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
}

function normalizeTime(value: string) {
  const match = value.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : value;
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse | Record<string, unknown> | Array<Record<string, unknown>>>;
  const data = axiosError.response?.data;

  if (!data) return fallback;
  if (Array.isArray(data)) {
    const firstError = data.find((item) => Object.keys(item).length > 0);
    if (firstError) return Object.entries(firstError).map(([key, value]) => `${key}: ${String(value)}`).join(", ");
    return fallback;
  }
  if ("detail" in data && data.detail) return String(data.detail);
  if ("error" in data && data.error) return String(data.error);
  if ("message" in data && data.message) return String(data.message);
  if ("non_field_errors" in data && Array.isArray(data.non_field_errors)) {
    return data.non_field_errors.join(", ");
  }

  const fieldErrors = Object.entries(data)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join(", ");

  return fieldErrors || fallback;
}

function formatDateRange(fromDate: string, toDate: string) {
  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return `${fromDate} - ${toDate}`;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${formatter.format(from)} - ${formatter.format(to)}`;
}

function BookingControlToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-[8px] bg-[#F1E8D7] px-4 py-4">
      <div>
        <p className="text-sm font-medium text-[#0A4833]">{title}</p>
        <p className="mt-1 text-xs text-[#8A8F98]">{description}</p>
      </div>
      <span className="relative inline-flex">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-[#D1D5DB] transition peer-checked:bg-[#0A4833]" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export default function UpdateAvailabilityPage() {
  const [weekAvailability, setWeekAvailability] = useState<DayAvailabilityForm[]>(createEmptyWeek);
  const [settings, setSettings] = useState<ConsultantSettingsForm>(DEFAULT_SETTINGS);
  const [blockedDates, setBlockedDates] = useState<BlockedDateItem[]>([]);
  const [blockedDateForm, setBlockedDateForm] = useState<BlockedDateForm>(DEFAULT_BLOCKED_FORM);
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [addingBlockedDate, setAddingBlockedDate] = useState(false);
  const [deletingBlockedDateId, setDeletingBlockedDateId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPageData() {
      setInitialLoading(true);
      setErrorMessage("");

      try {
        const [settingsResponse, blockedDatesResponse, availabilityResponse] = await Promise.all([
          api.get("/consultant/settings/"),
          api.get("/consultant/blocked-dates/"),
          api.get("/consultant/availability/"),
        ]);

        setSettings({
          accept_new: Boolean(settingsResponse.data?.accept_new),
          allow_same_day: Boolean(settingsResponse.data?.allow_same_day),
          show_profile: Boolean(settingsResponse.data?.show_profile),
          auto_close_full_day: Boolean(settingsResponse.data?.auto_close_full_day),
          followup_priority: Boolean(settingsResponse.data?.followup_priority),
        });

        setBlockedDates(Array.isArray(blockedDatesResponse.data) ? blockedDatesResponse.data : []);
        if (Array.isArray(availabilityResponse.data)) {
          const savedAvailability = availabilityResponse.data as AvailabilityItem[];
          setWeekAvailability((current) =>
            current.map((day) => {
              const savedDay = savedAvailability.find((item) => item.day === day.day);
              if (!savedDay) return { ...day, enabled: false };
              return {
                ...day,
                enabled: true,
                start_time: normalizeTime(savedDay.start_time),
                end_time: normalizeTime(savedDay.end_time),
              };
            }),
          );
        }
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, "Unable to load availability settings right now."));
      } finally {
        setInitialLoading(false);
      }
    }

    void loadPageData();
  }, []);

  const workingDays = useMemo(
    () => weekAvailability.filter((day) => day.enabled),
    [weekAvailability],
  );

  const estimatedWeeklySlots = useMemo(() => {
    return workingDays.reduce((total, day) => {
      const totalMinutes = getMinutesBetween(day.start_time, day.end_time);
      return total + Math.floor(Math.max(totalMinutes, 0) / 30);
    }, 0);
  }, [workingDays]);

  function updateDay(dayKey: WeekDayKey, updater: (current: DayAvailabilityForm) => DayAvailabilityForm) {
    setWeekAvailability((current) =>
      current.map((day) => (day.day === dayKey ? updater(day) : day)),
    );
  }

  function toggleDay(dayKey: WeekDayKey) {
    updateDay(dayKey, (current) => ({
      ...current,
      enabled: !current.enabled,
    }));
  }

  function updateTime(dayKey: WeekDayKey, field: "start_time" | "end_time", value: string) {
    updateDay(dayKey, (current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleSetting(settingKey: keyof ConsultantSettingsForm) {
    setSettings((current) => ({
      ...current,
      [settingKey]: !current[settingKey],
    }));
  }

  async function handleAddBlockedDate() {
    if (!blockedDateForm.from_date || !blockedDateForm.to_date) {
      setErrorMessage("Please choose both from and to dates.");
      return;
    }

    setAddingBlockedDate(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await api.post("/consultant/blocked-dates/", blockedDateForm);
      const createdDate = response.data?.data;

      if (createdDate) {
        setBlockedDates((current) => [...current, createdDate]);
      }

      setBlockedDateForm(DEFAULT_BLOCKED_FORM);
      setStatusMessage("Blocked date added successfully.");
    } catch {
      setErrorMessage("Unable to add the blocked date.");
    } finally {
      setAddingBlockedDate(false);
    }
  }

  async function handleDeleteBlockedDate(id: number) {
    setDeletingBlockedDateId(id);
    setErrorMessage("");
    setStatusMessage("");

    try {
      await api.delete("/consultant/blocked-dates/", { data: { id } });
      setBlockedDates((current) => current.filter((item) => item.id !== id));
      setStatusMessage("Blocked date removed successfully.");
    } catch {
      setErrorMessage("Unable to remove the blocked date.");
    } finally {
      setDeletingBlockedDateId(null);
    }
  }

  async function handleSaveAvailability() {
    const payload = workingDays.map((day) => ({
      day: day.day,
      start_time: normalizeTime(day.start_time),
      end_time: normalizeTime(day.end_time),
    }));

    if (!payload.length) {
      setErrorMessage("Select at least one available day before saving.");
      return;
    }
    const invalidDay = payload.find((day) => getMinutesBetween(day.start_time, day.end_time) <= 0);
    if (invalidDay) {
      setErrorMessage(`${WEEK_DAYS.find((day) => day.key === invalidDay.day)?.label ?? invalidDay.day}: end time must be after start time.`);
      return;
    }

    setSavingAvailability(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      await Promise.all([
        api.post("/consultant/availability/", payload),
        api.put("/consultant/settings/", settings),
      ]);
      setStatusMessage("Availability and booking controls saved successfully.");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to save availability. Please check your times and try again."));
    } finally {
      setSavingAvailability(false);
    }
  }

  if (initialLoading) {
    return (
      <main className="min-h-screen bg-[#FCFCFB] px-4 py-6 lg:px-6">
        <div className="mx-auto flex max-w-[920px] items-center justify-center rounded-[16px] border border-[#E7E1D4] bg-white px-6 py-16 text-[#0A4833]">
          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
          Loading availability settings...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFCFB] px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-[920px] space-y-5">
        <UpdateAvailabilityHeader />

        <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#0A4833]">Current Availability Summary</h2>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            <article className="rounded-[8px] bg-[#F1E8D7] px-4 py-3">
              <p className="text-[11px] text-[#8A8F98]">Status</p>
              <p className={`mt-2 text-sm font-semibold ${settings.accept_new ? "text-[#17914F]" : "text-[#B54708]"}`}>
                {settings.accept_new ? "Available" : "Bookings Paused"}
              </p>
            </article>
            <article className="rounded-[8px] bg-[#F1E8D7] px-4 py-3">
              <p className="text-[11px] text-[#8A8F98]">Working Days</p>
              <p className="mt-2 text-sm font-semibold text-[#8A6A33]">{workingDays.length} days/week</p>
            </article>
            <article className="rounded-[8px] bg-[#F1E8D7] px-4 py-3">
              <p className="text-[11px] text-[#8A8F98]">Estimated Slots</p>
              <p className="mt-2 text-sm font-semibold text-[#0A4833]">{estimatedWeeklySlots} this week</p>
            </article>
            <article className="rounded-[8px] bg-[#F1E8D7] px-4 py-3">
              <p className="text-[11px] text-[#8A8F98]">Session Duration</p>
              <p className="mt-2 text-sm font-semibold text-[#8A6A33]">30 minutes</p>
            </article>
          </div>
        </section>

        <section id="weekly-availability" className="rounded-[12px] border border-[#DFDFDF] bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-[#0A4833]">Weekly Availability</h2>
            <p className="text-xs text-[#8A8F98]">Slots are created only when you click save availability.</p>
          </div>

          <div className="mt-4 space-y-3">
            {weekAvailability.map((item) => (
              <article
                key={item.day}
                className={`rounded-[10px] border px-3 py-3 ${
                  item.enabled ? "border-[#E6D6BB] bg-[#F8F2E8]" : "border-[#ECECEC] bg-[#F8F8F8]"
                }`}
              >
                <div className="grid gap-3 md:grid-cols-[160px_140px_140px_minmax(0,1fr)] md:items-center">
                  <label className={`flex items-center gap-3 text-sm font-medium ${item.enabled ? "text-[#0A4833]" : "text-[#9CA3AF]"}`}>
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleDay(item.day)}
                      className="h-4 w-4 rounded border-[#D0D5DD] accent-[#1677FF]"
                    />
                    <span>{item.label}</span>
                  </label>

                  <input
                    type="time"
                    value={item.start_time}
                    disabled={!item.enabled}
                    onChange={(event) => updateTime(item.day, "start_time", event.target.value)}
                    className="h-9 min-w-[140px] rounded-[8px] border border-[#DFDFDF] bg-white px-3 text-sm text-[#344054] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
                  />

                  <input
                    type="time"
                    value={item.end_time}
                    disabled={!item.enabled}
                    onChange={(event) => updateTime(item.day, "end_time", event.target.value)}
                    className="h-9 min-w-[140px] rounded-[8px] border border-[#DFDFDF] bg-white px-3 text-sm text-[#344054] disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
                  />

                  <p className={`text-xs ${item.enabled ? "text-[#8A8F98]" : "text-[#B5B8BE]"}`}>
                    {item.enabled ? "Selected days will be saved to the backend." : "Not available"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#0A4833]">Consultation Booking Controls</h2>

          <div className="mt-4 space-y-3">
            <BookingControlToggle
              title="Accept New Consultations"
              description="Allow new clients to book consultations"
              checked={settings.accept_new}
              onChange={() => toggleSetting("accept_new")}
            />
            <BookingControlToggle
              title="Allow Same-Day Bookings"
              description="Clients can book consultations for today"
              checked={settings.allow_same_day}
              onChange={() => toggleSetting("allow_same_day")}
            />
            <BookingControlToggle
              title="Show Profile on Booking Page"
              description="Display your profile publicly for bookings"
              checked={settings.show_profile}
              onChange={() => toggleSetting("show_profile")}
            />
            <BookingControlToggle
              title="Auto-Close Fully Booked Days"
              description="Hide days with no available slots"
              checked={settings.auto_close_full_day}
              onChange={() => toggleSetting("auto_close_full_day")}
            />
            <BookingControlToggle
              title="Follow-Up Priority Slots"
              description="Reserve slots for existing client follow-ups"
              checked={settings.followup_priority}
              onChange={() => toggleSetting("followup_priority")}
            />
          </div>
        </section>

        <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#0A4833]">Blocked Dates &amp; Leave Settings</h2>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-[#667085]">From Date</label>
              <input
                type="date"
                value={blockedDateForm.from_date}
                onChange={(event) =>
                  setBlockedDateForm((current) => ({
                    ...current,
                    from_date: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F1E8D7] px-3 text-sm text-[#344054]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-[#667085]">To Date</label>
              <input
                type="date"
                value={blockedDateForm.to_date}
                onChange={(event) =>
                  setBlockedDateForm((current) => ({
                    ...current,
                    to_date: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F1E8D7] px-3 text-sm text-[#344054]"
              />
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <label className="text-[11px] font-medium text-[#667085]">Reason</label>
            <input
              type="text"
              value={blockedDateForm.reason}
              onChange={(event) =>
                setBlockedDateForm((current) => ({
                  ...current,
                  reason: event.target.value,
                }))
              }
              placeholder="Vacation, conference, emergency"
              className="h-10 w-full rounded-[8px] border border-[#DFDFDF] bg-[#F1E8D7] px-3 text-sm text-[#344054]"
            />
          </div>

          <button
            type="button"
            onClick={handleAddBlockedDate}
            disabled={addingBlockedDate}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-[8px] bg-[#A38355] px-4 text-sm font-medium text-white transition hover:bg-[#8E7149] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {addingBlockedDate ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Blocked Date"
            )}
          </button>

          <div className="mt-5">
            <p className="text-[11px] font-medium text-[#667085]">Upcoming Blocked Dates</p>

            <div className="mt-3 space-y-3">
              {blockedDates.length ? (
                blockedDates.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-[8px] bg-[#F1E8D7] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-[#A38355]" />
                      <div>
                        <p className="text-sm font-medium text-[#0A4833]">{formatDateRange(item.from_date, item.to_date)}</p>
                        <p className="text-xs text-[#8A8F98]">{item.reason || "Blocked"}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlockedDate(item.id)}
                      disabled={deletingBlockedDateId === item.id}
                      className="text-[#D92D20] transition hover:text-[#B42318] disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Remove blocked date"
                    >
                      {deletingBlockedDateId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-[8px] border border-dashed border-[#D8D8D8] px-4 py-5 text-sm text-[#667085]">
                  No upcoming blocked dates added yet.
                </div>
              )}
            </div>
          </div>
        </section>

        <AvailabilitySuggestionCard />

        {errorMessage ? (
          <div className="rounded-[10px] border border-[#F5C2C0] bg-[#FEF3F2] px-4 py-3 text-sm font-medium text-[#B42318]">
            {errorMessage}
          </div>
        ) : null}

        {statusMessage ? (
          <div className="rounded-[10px] border border-[#D8C9AE] bg-[#F8F3E9] px-4 py-3 text-sm font-medium text-[#0A4833]">
            {statusMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAvailability}
            disabled={savingAvailability}
            className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#0A4833] px-6 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(10,72,51,0.18)] transition hover:bg-[#083727] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {savingAvailability ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Availability...
              </>
            ) : (
              "Save Availability"
            )}
          </button>

          <Link
            href="/consultant/appointments"
            className="inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-[#4B5563] transition hover:text-[#0A4833]"
          >
            Cancel
          </Link>
        </div>
      </div>
    </main>
  );
}

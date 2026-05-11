import type { ChangeEvent, ReactNode } from "react";
import { CalendarDays, Clock3, UploadCloud } from "lucide-react";
import type { CreateEventFormData } from "../../types";

type Props = {
  formData: CreateEventFormData;
  onChange: (data: CreateEventFormData) => void;
};

type TextInputProps = {
  label: string;
  value?: string;
  placeholder?: string;
  className?: string;
  onValueChange?: (value: string) => void;
};

type SelectInputProps = {
  label: string;
  value: string;
  options: Array<string | { label: string; value: string }>;
  className?: string;
  onValueChange?: (value: string) => void;
};

type TextAreaInputProps = {
  label: string;
  rows: number;
  value?: string;
  onValueChange?: (value: string) => void;
};

const eventCategories = [
  { label: "Nutrition Session", value: "webinar" },
  { label: "Wellness Workshop", value: "workshop" },
  { label: "Community Meetup", value: "community" },
  { label: "Healthy Eating", value: "seminar" },
  { label: "Buckwheat Awareness", value: "other" },
];
const timezones = ["UTC", "GMT", "EST", "IST"];

const inputClass =
  "h-[46px] w-full rounded-[8px] border border-[#D1D5DB] bg-[#DFDFDF] px-4 text-[15px] font-normal tracking-[-0.5px] text-black outline-none";
const labelClass = "mb-2 block text-[14px] font-medium leading-[17px] tracking-[-0.5px] text-[#0A4833]";

function TextInput({ label, value, placeholder = "", className = "", onValueChange }: TextInputProps) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <input
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
        className={inputClass}
      />
    </label>
  );
}

function SelectInput({ label, value, options, className = "", onValueChange }: SelectInputProps) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      <select
        value={value}
        onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
        className={`${inputClass} appearance-auto`}
      >
        {options.map((item) => {
          const option = typeof item === "string" ? { label: item, value: item } : item;
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function TextAreaInput({ label, rows, value, onValueChange }: TextAreaInputProps) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
        className="w-full resize-none rounded-[8px] border border-[#D1D5DB] bg-[#DFDFDF] px-4 py-3 text-[15px] font-normal tracking-[-0.5px] text-black outline-none"
      />
    </label>
  );
}

function DateInput({ label, value, onValueChange }: TextInputProps) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <input
          type="date"
          value={value ?? ""}
          onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
          className={`${inputClass} pr-11`}
        />
        <CalendarDays size={22} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563]" />
      </div>
    </label>
  );
}

function TimeInput({ label, value, onValueChange }: TextInputProps) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <input
          type="time"
          value={value ?? ""}
          onChange={onValueChange ? (event) => onValueChange(event.target.value) : undefined}
          className={`${inputClass} pr-11`}
        />
        <Clock3 size={22} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#4B5563]" />
      </div>
    </label>
  );
}

function CheckboxInput({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <label className="flex h-5 items-center gap-3 text-[14px] font-medium leading-5 tracking-[-0.5px] text-[#0A4833]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="h-5 w-5 rounded-[1px] border border-black bg-white"
      />
      {label}
    </label>
  );
}

function Section({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <article className={`rounded-[12px] border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] ${className}`}>
      <h2 className="text-[20px] font-bold leading-7 tracking-[-0.5px] text-[#0A4833]">{title}</h2>
      {children}
    </article>
  );
}

export default function CreateEventFormSections({ formData, onChange }: Props) {
  function set(field: keyof CreateEventFormData) {
    return (v: string) => onChange({ ...formData, [field]: v });
  }

  function setBoolean(field: "is_online" | "show_in_community") {
    return (checked: boolean) => onChange({ ...formData, [field]: checked });
  }

  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange({
      ...formData,
      banner_file: file,
      banner_preview_url: URL.createObjectURL(file),
    });
  }

  return (
    <div className="space-y-5 font-['Inter',sans-serif]">
      <Section title="Basic Event Information">
        <div className="mt-5 grid gap-x-5 gap-y-4 md:grid-cols-2">
          <TextInput label="Event Title" className="md:col-span-2" value={formData.title} onValueChange={set("title")} />
          <TextInput label="Short Subtitle" className="md:col-span-2" value={formData.short_subtitle} onValueChange={set("short_subtitle")} />
          <SelectInput label="Event Category" value={formData.event_type} options={eventCategories} onValueChange={set("event_type")} />
          <SelectInput
            label="Event Type"
            value={formData.is_online ? "online" : "offline"}
            options={[
              { label: "Online", value: "online" },
              { label: "Offline", value: "offline" },
            ]}
            onValueChange={(value) => onChange({ ...formData, is_online: value === "online" })}
          />
          <TextInput label="Host/Speaker Name" value={formData.institutional_name} onValueChange={set("institutional_name")} />
          <SelectInput
            label="Event Status"
            value={formData.status}
            options={[
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
            ]}
            onValueChange={set("status")}
          />
        </div>
      </Section>

      <Section title="Event Banner">
        <div className="mt-5 flex h-[200px] flex-col items-center justify-center rounded-[8px] border border-dashed border-[#D1D5DB] bg-[#F7F6F2] px-4 text-center">
          <input id="event-banner-upload" type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          {formData.banner_preview_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={formData.banner_preview_url} alt="Event banner preview" className="mb-3 h-32 w-full rounded-[8px] object-cover" />
          ) : (
            <>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DDC9] text-[#9F8151]">
                <UploadCloud size={24} />
              </div>
              <p className="mt-4 text-[14px] font-medium leading-5 tracking-[-0.5px] text-[#0A4833]">Upload Event Banner</p>
              <p className="mt-1 text-[14px] leading-5 tracking-[-0.5px] text-[#4B5563]">Drag and drop your image here, or click to browse</p>
              <p className="mt-1 text-[12px] leading-4 tracking-[-0.5px] text-[#6B7280]">Recommended size: 1200x400px, Max file size: 5MB</p>
            </>
          )}
          <label htmlFor="event-banner-upload" className="mt-4 inline-flex h-[34px] cursor-pointer items-center rounded-[4px] bg-[#9F8151] px-4 text-[12px] font-medium tracking-[-0.5px] text-white">
            {formData.banner_preview_url ? "Change File" : "Choose File"}
          </label>
        </div>
      </Section>

      <Section title="Event Description">
        <div className="mt-5 space-y-5">
          <TextAreaInput label="Short Description" rows={3} value={formData.short_description} onValueChange={set("short_description")} />
          <TextAreaInput label="Full Event Description" rows={5} value={formData.full_description} onValueChange={set("full_description")} />
          <TextAreaInput label="Event Agenda/Highlights" rows={4} value={formData.agenda_highlights} onValueChange={set("agenda_highlights")} />
        </div>
      </Section>

      <Section title="Date &amp; Time Scheduling">
        <div className="mt-5 grid gap-x-5 gap-y-5 md:grid-cols-3">
          <DateInput label="Event Date" value={formData.start_date} onValueChange={set("start_date")} />
          <TimeInput label="Start Time" value={formData.start_time} onValueChange={set("start_time")} />
          <TimeInput label="End Time" value={formData.end_time} onValueChange={set("end_time")} />
          <SelectInput label="Timezone" value={formData.timezone} options={timezones} onValueChange={set("timezone")} />
          <DateInput label="Registration Deadline" value={formData.end_date} onValueChange={set("end_date")} />
          {/* <div className="flex items-center pt-7">
            <CheckboxInput label="Repeat Event" checked={formData.show_in_community} onCheckedChange={setBoolean("show_in_community")} />
          </div> */}
        </div>
      </Section>

      <Section title="Registration Settings">
        <div className="mt-5 grid gap-x-5 gap-y-4 md:grid-cols-2">
          <TextInput label="Maximum Attendees" value={formData.max_attendees} onValueChange={set("max_attendees")} />
          {/* <div className="space-y-4 pt-0 md:pt-1">
            <CheckboxInput label="Enable Registration" checked={formData.enable_registration} onCheckedChange={setBoolean("enable_registration")} />
            <CheckboxInput label="Enable Waitlist" checked={formData.waitlist_enabled} onCheckedChange={setBoolean("waitlist_enabled")} />
            <CheckboxInput label="Approval Required" checked={formData.approval_required} onCheckedChange={setBoolean("approval_required")} />
          </div> */}
        </div>
      </Section>

      <Section title="Event Tags">
        <div className="mt-6 grid max-w-[720px] grid-cols-2 gap-x-8 gap-y-6 text-[14px] font-normal leading-5 tracking-[-0.5px] text-[#374151] sm:grid-cols-3">
          {eventCategories.map((tag) => {
            const isSelected = formData.event_type === tag.value;
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => onChange({ ...formData, event_type: tag.value })}
                className={`w-fit whitespace-nowrap rounded-[6px] px-2 py-1 text-left transition ${
                  isSelected ? "bg-[#0A4833] font-semibold text-white" : "text-[#374151] hover:bg-[#F3F0EA]"
                }`}
                aria-pressed={isSelected}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

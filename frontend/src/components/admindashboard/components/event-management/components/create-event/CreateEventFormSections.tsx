import { UploadCloud } from "lucide-react";
import { DateField, Field, SelectField, TextAreaField, TimeField } from "./CreateEventFields";

type FormData = {
  title: string;
  short_description: string;
  full_description: string;
  event_type: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  is_online: boolean;
  location: string;
  meeting_link: string;
  max_attendees: string;
  status: string;
  show_in_community: boolean;
};

type Props = {
  formData: FormData;
  onChange: (data: FormData) => void;
};

const eventTypes = [
  { label: "Webinar", value: "webinar" },
  { label: "Workshop", value: "workshop" },
  { label: "Seminar", value: "seminar" },
  { label: "Community Meetup", value: "community" },
  { label: "Other", value: "other" },
];
const hostTypes = ["Individual", "Organization"];
const timezones = ["UTC", "GMT", "EST", "IST"];

export default function CreateEventFormSections({ formData, onChange }: Props) {
  function set(field: keyof FormData) {
    return (v: string) => onChange({ ...formData, [field]: v });
  }

  function setBoolean(field: "is_online" | "show_in_community") {
    return (checked: boolean) => onChange({ ...formData, [field]: checked });
  }

  return (
    <>
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Basic Event Information</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Event Title" className="md:col-span-2" value={formData.title} onValueChange={set("title")} />
          <Field label="Start Date" className="md:col-span-2" value={formData.start_date} onValueChange={set("start_date")} />
          <SelectField label="Event Type" value={formData.event_type} options={eventTypes} onValueChange={set("event_type")} />
          <SelectField label="Publish Status" value={formData.status} options={[{ label: "Published", value: "published" }, { label: "Draft", value: "draft" }]} onValueChange={set("status")} />
          <Field label="Institutional Name" value="" onValueChange={() => {}} />
          <SelectField label="Host Type" value="Direct" options={hostTypes} onValueChange={() => {}} />
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Event Banner</h2>
        <div className="mt-3 flex h-[170px] flex-col items-center justify-center rounded-lg border border-[#DFDFDF] bg-[#F7F6F2] px-4 text-center">
          <input id="event-banner-upload" type="file" accept="image/*" className="hidden" />
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE2CF] text-[#9F8151]">
            <UploadCloud size={18} />
          </div>
          <p className="mt-2 text-xs font-medium text-[#0A4833]">Upload Event Banner</p>
          <p className="mt-1 text-[11px] text-[#6B7280]">Drag and drop your image here, or click to browse</p>
          <p className="text-[11px] text-[#9CA3AF]">Recommended size: 1200x400px, Max file size: 5MB</p>
          <label htmlFor="event-banner-upload" className="mt-2 cursor-pointer rounded-md bg-[#9F8151] px-3 py-1 text-xs font-medium text-white">
            Browse File
          </label>
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Event Description</h2>
        <div className="mt-3 space-y-3">
          <TextAreaField label="Short Description" rows={3} value={formData.short_description} onValueChange={set("short_description")} />
          <TextAreaField label="Full Event Description" rows={4} value={formData.full_description} onValueChange={set("full_description")} />
          <TextAreaField label="Event Agenda Highlights" rows={3} value="" onValueChange={() => {}} />
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Date &amp; Time Scheduling</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <DateField label="Event Date" value={formData.start_date} onValueChange={set("start_date")} />
          <TimeField label="Start Time" value={formData.start_time} onValueChange={set("start_time")} />
          <TimeField label="End Time" value={formData.end_time} onValueChange={set("end_time")} />
          <SelectField label="Timezone" value="UTC" options={timezones} onValueChange={() => {}} />
          <DateField label="End Date" value={formData.end_date} onValueChange={set("end_date")} />
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-xs text-[#6B7280]">
              <input type="checkbox" checked={formData.show_in_community} onChange={(event) => setBoolean("show_in_community")(event.target.checked)} className="h-3.5 w-3.5 rounded border-[#CFCFCF]" />
              Show in Community
            </label>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Venue &amp; Access</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 pt-6 text-xs text-[#0A4833]">
            <input type="checkbox" checked={formData.is_online} onChange={(event) => setBoolean("is_online")(event.target.checked)} className="h-3.5 w-3.5 rounded border-[#CFCFCF]" />
            Online event
          </label>
          <Field label="Location" value={formData.location} onValueChange={set("location")} />
          <Field label="Meeting Link" className="md:col-span-2" value={formData.meeting_link} onValueChange={set("meeting_link")} />
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Registration Settings</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Maximum Attendees" value={formData.max_attendees} onValueChange={set("max_attendees")} />
          <div className="space-y-2 pt-5 text-xs text-[#0A4833]">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CFCFCF]" />
              Enable Registration
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CFCFCF]" />
              Waitlist Enabled
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CFCFCF]" />
              Approval Required
            </label>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Event Tags</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Nutrition Session", "Wellness Workshop", "Community Meetup", "Healthy Eating", "Buckwheat Awareness"].map((tag) => (
            <span key={tag} className="rounded-full bg-[#F3F0EA] px-3 py-1 text-xs text-[#6B7280]">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </>
  );
}

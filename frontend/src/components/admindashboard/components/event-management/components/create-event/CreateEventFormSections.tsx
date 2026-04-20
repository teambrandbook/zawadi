import { UploadCloud } from "lucide-react";
import { DateField, Field, SelectField, TextAreaField, TimeField } from "./CreateEventFields";

const eventTypes = ["Online", "Offline"];
const hostTypes = ["Individual", "Organization"];
const timezones = ["UTC", "GMT", "EST", "IST"];

export default function CreateEventFormSections() {
  return (
    <>
      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Basic Event Information</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Event Title" className="md:col-span-2" />
          <Field label="Start Date" className="md:col-span-2" />
          <SelectField label="Event Category" value="Nutrition Session" options={["Nutrition Session", "Community Meetup"]} />
          <SelectField label="Event Type" value="Online" options={eventTypes} />
          <Field label="Institutional Name" />
          <SelectField label="Host Type" value="Direct" options={hostTypes} />
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
          <TextAreaField label="Short Description" rows={3} />
          <TextAreaField label="Full Event Description" rows={4} />
          <TextAreaField label="Event Agenda Highlights" rows={3} />
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Date &amp; Time Scheduling</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <DateField label="Event Date" />
          <TimeField label="Start Time" />
          <TimeField label="End Time" />
          <SelectField label="Timezone" value="UTC" options={timezones} />
          <DateField label="Registration Deadline" />
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-xs text-[#6B7280]">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-[#CFCFCF]" />
              Repeat Event
            </label>
          </div>
        </div>
      </article>

      <article className="rounded-xl border border-[#DFDFDF] bg-white p-4">
        <h2 className="text-sm font-semibold text-[#0A4833]">Registration Settings</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Maximum Attendees" />
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


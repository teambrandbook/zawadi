import { CalendarClock, ChevronDown, Clock3, Globe2, Languages, Lightbulb } from "lucide-react";
import type { LocalizationFormat } from "../settingsTypes";

type LocalizationFormatCardProps = {
  data: LocalizationFormat;
  onChange: (field: keyof LocalizationFormat, value: string) => void;
};

const selectClass = "w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none sm:text-base";

export default function LocalizationFormatCard({ data, onChange }: LocalizationFormatCardProps) {
  return (
    <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#9F8151]/10 text-[#9F8151]">
          <Languages size={18} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0A4833]">Localization &amp; Format</h2>
          <p className="mt-1 text-xs text-[#0A4833]/60 sm:text-sm">
            Set default language, timezone, and display formats for the platform
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Default Language</p>
          <div className="flex h-[44px] items-center justify-between rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 focus-within:border-[#9F8151]">
            <span className="inline-flex items-center gap-2">
              <Globe2 size={13} className="text-[#9F8151]" />
              <select value={data.language} onChange={(event) => onChange("language", event.target.value)} className={selectClass}>
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Malayalam</option>
                <option>Hindi</option>
              </select>
            </span>
            <ChevronDown size={13} className="text-[#9EB8A8]" />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Default Timezone</p>
          <div className="flex h-[44px] items-center justify-between rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 focus-within:border-[#9F8151]">
            <span className="inline-flex items-center gap-2">
              <Clock3 size={13} className="text-[#9F8151]" />
              <select value={data.timezone} onChange={(event) => onChange("timezone", event.target.value)} className={selectClass}>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+5:30 (India Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+4 (Gulf Time)</option>
              </select>
            </span>
            <ChevronDown size={13} className="text-[#9EB8A8]" />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Date Format</p>
          <div className="flex h-[44px] items-center justify-between rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 focus-within:border-[#9F8151]">
            <span className="inline-flex items-center gap-2">
              <CalendarClock size={13} className="text-[#9F8151]" />
              <select value={data.dateFormat} onChange={(event) => onChange("dateFormat", event.target.value)} className={selectClass}>
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </span>
            <ChevronDown size={13} className="text-[#9EB8A8]" />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Time Format</p>
          <div className="flex h-[44px] items-center justify-between rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 focus-within:border-[#9F8151]">
            <span className="inline-flex items-center gap-2">
              <Clock3 size={13} className="text-[#9F8151]" />
              <select value={data.timeFormat} onChange={(event) => onChange("timeFormat", event.target.value)} className={selectClass}>
                <option>12-hour (AM/PM)</option>
                <option>24-hour</option>
              </select>
            </span>
            <ChevronDown size={13} className="text-[#9EB8A8]" />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border-l-4 border-[#9F8151] bg-[#9F81510D] p-3">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">
          <Lightbulb size={11} className="text-[#9F8151]" />
          Format Preview
        </p>
        <p className="mt-1.5 text-xs text-[#0A4833B3] sm:text-sm">
          Current settings will display as:{" "}
          <span className="font-semibold text-[#9F8151]">{data.preview}</span>
        </p>
      </div>
    </article>
  );
}

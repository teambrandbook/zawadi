import { CalendarDays, Clock3 } from "lucide-react";

type FieldProps = {
  label: string;
  placeholder?: string;
  className?: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
};

type TextAreaFieldProps = {
  label: string;
  rows: number;
};

export function Field({ label, placeholder = "", className = "" }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <input
        type="text"
        placeholder={placeholder}
        className="h-9 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none"
      />
    </label>
  );
}

export function SelectField({ label, value, options }: SelectFieldProps) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <select className="h-9 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none">
        <option>{value}</option>
        {options.filter((item) => item !== value).map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

export function TextAreaField({ label, rows }: TextAreaFieldProps) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <textarea
        rows={rows}
        className="w-full resize-none rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 py-2 text-xs text-[#111827] outline-none"
      />
    </label>
  );
}

export function DateField({ label }: { label: string }) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <div className="relative">
        <input type="date" className="h-9 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none" />
        <CalendarDays size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
      </div>
    </label>
  );
}

export function TimeField({ label }: { label: string }) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <div className="relative">
        <input type="time" className="h-9 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none" />
        <Clock3 size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
      </div>
    </label>
  );
}


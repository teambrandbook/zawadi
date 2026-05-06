import { CalendarDays, Clock3 } from "lucide-react";

type FieldProps = {
  label: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onValueChange?: (v: string) => void;
};

type SelectFieldProps = {
  label: string;
  value: string;
  options: Array<string | { label: string; value: string }>;
  onValueChange?: (v: string) => void;
};

type TextAreaFieldProps = {
  label: string;
  rows: number;
  value?: string;
  onValueChange?: (v: string) => void;
};

type DateTimeFieldProps = {
  label: string;
  value?: string;
  onValueChange?: (v: string) => void;
};

export function Field({ label, placeholder = "", className = "", value, onValueChange }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <input
        type="text"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
        className="h-9 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none"
      />
    </label>
  );
}

export function SelectField({ label, value, options, onValueChange }: SelectFieldProps) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <select
        value={value}
        onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
        className="h-9 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none"
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

export function TextAreaField({ label, rows, value, onValueChange }: TextAreaFieldProps) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
        className="w-full resize-none rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 py-2 text-xs text-[#111827] outline-none"
      />
    </label>
  );
}

export function DateField({ label, value, onValueChange }: DateTimeFieldProps) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <div className="relative">
        <input
          type="date"
          value={value ?? ""}
          onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
          className="h-9 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none"
        />
        <CalendarDays size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
      </div>
    </label>
  );
}

export function TimeField({ label, value, onValueChange }: DateTimeFieldProps) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] text-[#0A4833]">{label}</p>
      <div className="relative">
        <input
          type="time"
          value={value ?? ""}
          onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
          className="h-9 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-xs text-[#111827] outline-none"
        />
        <Clock3 size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
      </div>
    </label>
  );
}

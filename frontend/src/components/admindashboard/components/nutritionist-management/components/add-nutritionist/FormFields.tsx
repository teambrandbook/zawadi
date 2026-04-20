type FieldProps = {
  label: string;
  placeholder: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
};

type TextAreaFieldProps = {
  label: string;
  placeholder: string;
};

export function Field({ label, placeholder }: FieldProps) {
  return (
    <label className="block">
      <p className="mb-1.5 text-xs font-medium text-[#0A4833]">{label}</p>
      <input
        type="text"
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
      />
    </label>
  );
}

export function SelectField({ label, value }: SelectFieldProps) {
  return (
    <label className="block">
      <p className="mb-1.5 text-xs font-medium text-[#0A4833]">{label}</p>
      <select className="h-11 w-full rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 text-sm text-[#111827] outline-none">
        <option>{value}</option>
      </select>
    </label>
  );
}

export function TextAreaField({ label, placeholder }: TextAreaFieldProps) {
  return (
    <label className="block">
      <p className="mb-1.5 text-xs font-medium text-[#0A4833]">{label}</p>
      <textarea
        rows={4}
        placeholder={placeholder}
        className="w-full resize-none rounded-md border border-[#DFDFDF] bg-[#F3F3F3] px-3 py-2.5 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
      />
    </label>
  );
}


import CreateUserSection from "./CreateUserSection";

type Props = {
  values: {
    addressLine: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  onChange: (field: string, value: string) => void;
};

const inputClass = "h-12 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F7F7] px-3 text-sm outline-none ring-[#0A4833]/20 focus:ring-2";

export default function AddressSection({ values, onChange }: Props) {
  return (
    <CreateUserSection title="Address & Contact Details">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm text-[#0A4833] md:col-span-2">Address Line *
          <input className={inputClass} placeholder="Street address" value={values.addressLine} onChange={(e) => onChange("addressLine", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">City
          <input className={inputClass} placeholder="City" value={values.city} onChange={(e) => onChange("city", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">State
          <input className={inputClass} placeholder="State" value={values.state} onChange={(e) => onChange("state", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">Country
          <select className={inputClass} value={values.country} onChange={(e) => onChange("country", e.target.value)}>
            <option>Select country</option>
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
          </select>
        </label>
        <label className="text-sm text-[#0A4833]">Postal Code
          <input className={inputClass} placeholder="ZIP/Postal Code" value={values.postalCode} onChange={(e) => onChange("postalCode", e.target.value)} />
        </label>
      </div>
    </CreateUserSection>
  );
}

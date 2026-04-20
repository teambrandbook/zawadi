import CreateUserSection from "./CreateUserSection";

type Props = {
  values: {
    address_line: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  onChange: (field: string, value: string) => void;
};

const inputClass =
  "h-12 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F7F7] px-3 text-sm outline-none ring-[#0A4833]/20 focus:ring-2";

export default function AddressSection({ values, onChange }: Props) {
  return (
    <CreateUserSection title="Address & Contact Details">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Address Line */}
        <label className="text-sm text-[#0A4833] md:col-span-2">
          Address Line *
          <input
            type="text"
            className={inputClass}
            placeholder="Street address"
            value={values.address_line}
            onChange={(e) => onChange("address_line", e.target.value)}
          />
        </label>

        {/* City */}
        <label className="text-sm text-[#0A4833]">
          City
          <input
            type="text"
            className={inputClass}
            placeholder="City"
            value={values.city}
            onChange={(e) => onChange("city", e.target.value)}
          />
        </label>

        {/* State */}
        <label className="text-sm text-[#0A4833]">
          State
          <input
            type="text"
            className={inputClass}
            placeholder="State"
            value={values.state}
            onChange={(e) => onChange("state", e.target.value)}
          />
        </label>

        {/* Country */}
        <label className="text-sm text-[#0A4833]">
          Country
          <select
            className={inputClass}
            value={values.country}
            onChange={(e) => onChange("country", e.target.value)}
          >
            <option value="">Select country</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </label>

        {/* Postal Code */}
        <label className="text-sm text-[#0A4833]">
          Postal Code
          <input
            type="text"
            className={inputClass}
            placeholder="ZIP/Postal Code"
            value={values.postal_code}
            onChange={(e) => onChange("postal_code", e.target.value)}
          />
        </label>

      </div>
    </CreateUserSection>
  );
}
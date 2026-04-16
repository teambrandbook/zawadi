import CreateUserSection from "./CreateUserSection";

type Props = {
  values: {
    fullName: string;
    email: string;
    phone: string;
    username: string;
    dateOfBirth: string;
    gender: string;
    location: string;
  };
  onChange: (field: string, value: string) => void;
};

const inputClass = "h-12 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F7F7] px-3 text-sm outline-none ring-[#0A4833]/20 focus:ring-2";

export default function BasicInfoSection({ values, onChange }: Props) {
  return (
    <CreateUserSection title="Basic User Information">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm text-[#0A4833]">Full Name *
          <input className={inputClass} placeholder="Enter full name" value={values.fullName} onChange={(e) => onChange("fullName", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">Email Address *
          <input className={inputClass} placeholder="user@example.com" value={values.email} onChange={(e) => onChange("email", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">Phone Number *
          <input className={inputClass} placeholder="+1 (555) 000-0000" value={values.phone} onChange={(e) => onChange("phone", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">Username *
          <input className={inputClass} placeholder="username" value={values.username} onChange={(e) => onChange("username", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">Date of Birth
          <input type="date" className={inputClass} value={values.dateOfBirth} onChange={(e) => onChange("dateOfBirth", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">Gender
          <select className={inputClass} value={values.gender} onChange={(e) => onChange("gender", e.target.value)}>
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>
        <label className="text-sm text-[#0A4833] md:col-span-2">Location
          <input className={inputClass} placeholder="City, Country" value={values.location} onChange={(e) => onChange("location", e.target.value)} />
        </label>
      </div>
    </CreateUserSection>
  );
}

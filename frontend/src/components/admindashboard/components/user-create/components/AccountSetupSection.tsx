import CreateUserSection from "./CreateUserSection";

type Props = {
  values: {
    tempPassword: string;
    confirmPassword: string;
    memberId: string;
    accountStatus: string;
  };
  onChange: (field: string, value: string) => void;
};

const inputClass = "h-12 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F7F7] px-3 text-sm outline-none ring-[#0A4833]/20 focus:ring-2";

export default function AccountSetupSection({ values, onChange }: Props) {
  return (
    <CreateUserSection title="Account Setup">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm text-[#0A4833]">Temporary Password *
          <input type="password" className={inputClass} placeholder="Enter password" value={values.tempPassword} onChange={(e) => onChange("tempPassword", e.target.value)} />
          <p className="mt-1 text-xs text-[#6B7280]">Min. 8 characters with uppercase, lowercase & number</p>
        </label>
        <label className="text-sm text-[#0A4833]">Confirm Password *
          <input type="password" className={inputClass} placeholder="Confirm password" value={values.confirmPassword} onChange={(e) => onChange("confirmPassword", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">Member ID
          <input className={inputClass} placeholder="ZW-2024-0847" value={values.memberId} onChange={(e) => onChange("memberId", e.target.value)} />
        </label>
        <label className="text-sm text-[#0A4833]">Account Status
          <select className={inputClass} value={values.accountStatus} onChange={(e) => onChange("accountStatus", e.target.value)}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
        </label>
      </div>
    </CreateUserSection>
  );
}

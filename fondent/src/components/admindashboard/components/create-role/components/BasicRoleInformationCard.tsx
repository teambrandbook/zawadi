import { ChevronDown } from "lucide-react";

type Props = {
  roleName: string;
  accessLevel: string;
  roleStatus: string;
  onChange: (field: string, value: string) => void;
};

export default function BasicRoleInformationCard({ roleName, accessLevel, roleStatus, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-[#D9D9D9] bg-white px-6 py-6">
      <h2 className="text-3xl font-bold text-[#06402B]">Basic Role Information</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#06402B]">
            Role Name <span className="text-[#A38653]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Content Manager"
            value={roleName}
            onChange={(e) => onChange("role_name", e.target.value)} // ✅ update role name
            className="h-12 w-full rounded-xl border border-[#D9D9D9] bg-[#F3F2EF] px-4 text-base text-[#4B5563] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#06402B]">Access Level Summary</label>
          <div className="relative">
            <select
              value={accessLevel}
              onChange={(e) => onChange("access_level", e.target.value)} // ✅ update access level
              className="h-12 w-full appearance-none rounded-xl border border-[#D9D9D9] bg-[#F3F2EF] px-4 pr-10 text-base text-[#2C7A62] outline-none"
            >
              <option value="medium">Medium Access</option>
              <option value="full">Full Access</option>
              <option value="low">Limited Access</option>
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#06402B]" />
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-[520px]">
        <label className="mb-2 block text-sm font-semibold text-[#06402B]">Role Status</label>
        <div className="relative">
          <select
            value={roleStatus}
            onChange={(e) => onChange("role_status", e.target.value)} // ✅ update role status
            className="h-12 w-full appearance-none rounded-xl border border-[#D9D9D9] bg-[#F3F2EF] px-4 pr-10 text-base text-[#2C7A62] outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#06402B]" />
        </div>
      </div>
    </section>
  );
}
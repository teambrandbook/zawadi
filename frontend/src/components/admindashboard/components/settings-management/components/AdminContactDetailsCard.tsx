import { ChevronDown, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import type { AdminContact } from "../settingsTypes";

type AdminContactDetailsCardProps = {
  data: AdminContact;
  onChange: (field: keyof AdminContact, value: string) => void;
};

export default function AdminContactDetailsCard({ data, onChange }: AdminContactDetailsCardProps) {
  return (
    <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A4833]/10 text-[#0A4833]">
          <ShieldCheck size={18} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0A4833]">Admin Contact Details</h2>
          <p className="mt-1 text-xs text-[#0A4833]/60 sm:text-sm">
            Primary administrator information for system notifications and alerts
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Admin Full Name</p>
          <div className="flex h-[44px] items-center gap-2 rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 focus-within:border-[#9F8151]">
            <UserRound size={13} className="text-[#9F8151]" />
            <input
              value={data.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
              className="w-full bg-transparent text-sm text-[#0A4833] outline-none sm:text-base"
            />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Admin Email</p>
          <div className="flex h-[44px] items-center gap-2 rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 focus-within:border-[#9F8151]">
            <Mail size={13} className="text-[#9F8151]" />
            <input
              type="email"
              value={data.email}
              onChange={(event) => onChange("email", event.target.value)}
              className="w-full bg-transparent text-sm text-[#0A4833] outline-none sm:text-base"
            />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Admin Phone</p>
          <div className="flex h-[44px] items-center gap-2 rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 focus-within:border-[#9F8151]">
            <Phone size={13} className="text-[#9F8151]" />
            <input
              value={data.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              className="w-full bg-transparent text-sm text-[#0A4833] outline-none sm:text-base"
            />
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#0A4833] sm:text-sm">Admin Role</p>
          <div className="flex h-[44px] items-center justify-between rounded-md border-2 border-[#DFDFDF] bg-[#EBE1CF4D] px-3 focus-within:border-[#9F8151]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={13} className="text-[#9F8151]" />
              <select
                value={data.role}
                onChange={(event) => onChange("role", event.target.value)}
                className="w-full appearance-none bg-transparent text-sm text-[#0A4833] outline-none sm:text-base"
              >
                <option>Super Administrator</option>
                <option>Administrator</option>
                <option>Support Manager</option>
              </select>
            </span>
            <ChevronDown size={13} className="text-[#9EB8A8]" />
          </div>
        </div>
      </div>
    </article>
  );
}

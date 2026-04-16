import { useState } from "react";
import CreateUserSection from "./CreateUserSection";

type Props = {
  values: {
    password: string;
    accountStatus: string;
  };
  onChange: (field: string, value: string) => void;
};

const inputClass =
  "h-12 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F7F7] px-3 text-sm outline-none ring-[#0A4833]/20 focus:ring-2";

export default function AccountSetupSection({ values, onChange }: Props) {
  
  // ✅ Local state for confirm password
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMismatch =
    confirmPassword && values.password !== confirmPassword;

  return (
    <CreateUserSection title="Account Setup">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* Password */}
        <label className="text-sm text-[#0A4833]">
          Password *
          <input
            type="password"
            className={inputClass}
            placeholder="Enter password"
            value={values.password}
            onChange={(e) => onChange("password", e.target.value)} // ✅ send only password
          />
        </label>

        {/* Confirm Password (local only) */}
        <label className="text-sm text-[#0A4833]">
          Confirm Password *
          <input
            type="password"
            className={inputClass}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {passwordMismatch && (
            <p className="text-red-500 text-xs mt-1">
              Passwords do not match ❌
            </p>
          )}
        </label>

        {/* Account Status */}
        <label className="text-sm text-[#0A4833]">
          Account Status
          <select
            className={inputClass}
            value={values.accountStatus}
            onChange={(e) => onChange("accountStatus", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </label>

      </div>
    </CreateUserSection>
  );
}
import { useState } from "react";
import CreateUserSection from "./CreateUserSection";

type Props = {
  values: {
    password: string;
    is_active: boolean;
  };
  onChange: (field: string, value: string | boolean) => void; // ✅ FIXED
};

const inputClass =
  "h-12 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F7F7] px-3 text-sm outline-none ring-[#0A4833]/20 focus:ring-2";

export default function AccountSetupSection({ values, onChange }: Props) {

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
            onChange={(e) => onChange("password", e.target.value)}
          />
        </label>

        {/* Confirm Password */}
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
          <div className="flex gap-4 mt-2">
            <label>
              <input
                type="radio"
                checked={values.is_active === true}
                onChange={() => onChange("is_active", true)}
              />
              Active
            </label>

            <label>
              <input
                type="radio"
                checked={values.is_active === false}
                onChange={() => onChange("is_active", false)}
              />
              Inactive
            </label>
          </div>
        </label>

      </div>
    </CreateUserSection>
  );
}
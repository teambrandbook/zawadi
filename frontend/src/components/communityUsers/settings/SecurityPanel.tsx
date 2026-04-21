import { CheckCircle2, KeyRound, Laptop, Lock, LogOut, RotateCcw, Save, Shield, Smartphone } from "lucide-react";
import type { LoginActivity, SecurityStatusItem } from "./settingsTypes";

type Props = {
  twoFactorEnabled: boolean;
  loginActivity: LoginActivity[];
  securityStatus: SecurityStatusItem[];
  onToggleTwoFactor: () => void;
  onChangePassword: () => void;
  onSave: () => void;
  onLogoutAllDevices: () => void;
};

function ToggleButton({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-12 rounded-full transition ${enabled ? "bg-[#06402B]" : "bg-[#E5E7EB]"}`}
      aria-pressed={enabled}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-7" : "left-1"}`} />
    </button>
  );
}

export default function SecurityPanel({
  twoFactorEnabled,
  loginActivity,
  securityStatus,
  onToggleTwoFactor,
  onChangePassword,
  onSave,
  onLogoutAllDevices,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <section className="rounded-lg border border-[#DFDFDF] bg-white p-6">
            <h2 className="inline-flex items-center gap-3 text-xl font-bold text-[#06402B]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E8F2ED] text-[#06402B]">
                <KeyRound className="h-5 w-5" />
              </span>
              Password Management
            </h2>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-[#374151]">
                Current Password
                <input
                  type="password"
                  className="mt-2 h-11 w-full rounded-md border border-[#DFDFDF] bg-white px-4 text-sm outline-none focus:border-[#06402B]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#374151]">
                New Password
                <input
                  type="password"
                  className="mt-2 h-11 w-full rounded-md border border-[#DFDFDF] bg-white px-4 text-sm outline-none focus:border-[#06402B]"
                />
              </label>
              <label className="block text-sm font-semibold text-[#374151]">
                Confirm New Password
                <input
                  type="password"
                  className="mt-2 h-11 w-full rounded-md border border-[#DFDFDF] bg-white px-4 text-sm outline-none focus:border-[#06402B]"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={onChangePassword}
              className="mt-5 h-12 w-full rounded-md bg-[#06402B] text-sm font-semibold text-white hover:bg-[#053020]"
            >
              Change Password
            </button>
          </section>

          <section className="rounded-lg border border-[#DFDFDF] bg-white p-6">
            <h2 className="inline-flex items-center gap-3 text-xl font-bold text-[#06402B]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F8F3E9] text-[#A88751]">
                <Smartphone className="h-5 w-5" />
              </span>
              Two-Factor Authentication
            </h2>

            <div className="mt-6 rounded-md bg-[#F4F1EA] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#111827]">Enable 2FA</p>
                  <p className="mt-1 text-xs text-[#4B5563]">Add an extra layer of security</p>
                </div>
                <ToggleButton enabled={twoFactorEnabled} onClick={onToggleTwoFactor} />
              </div>
            </div>

            <label className="mt-4 block text-sm font-semibold text-[#374151]">
              Authentication Method
              <select className="mt-2 h-11 w-full rounded-md border border-[#DFDFDF] bg-white px-4 text-sm font-normal outline-none focus:border-[#06402B]">
                <option>SMS Text Message</option>
                <option>Email Verification</option>
                <option>Authenticator App</option>
              </select>
            </label>

            <div className="mt-5 rounded-md border border-[#BBF7D0] bg-[#ECFDF3] p-4 text-sm font-semibold text-[#16A34A]">
              <CheckCircle2 className="mr-2 inline h-4 w-4 align-[-2px]" />
              2FA Status: {twoFactorEnabled ? "Active" : "Inactive"}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-[#DFDFDF] bg-white p-6">
            <h2 className="inline-flex items-center gap-3 text-xl font-bold text-[#06402B]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#E8F2ED] text-[#06402B]">
                <RotateCcw className="h-5 w-5" />
              </span>
              Recent Login Activity
            </h2>

            <div className="mt-5 space-y-3">
              {loginActivity.map((item) => (
                <article key={item.id} className="flex items-center justify-between gap-4 rounded-md border border-[#DFDFDF] bg-white p-4">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-[#9CA3AF]" />
                    <div>
                      <p className="text-base font-semibold text-[#111827]">{item.device}</p>
                      <p className="mt-1 text-xs text-[#4B5563]">{item.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {item.current && (
                      <span className="mb-2 inline-flex rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-semibold text-[#16A34A]">
                        Current
                      </span>
                    )}
                    <p className="text-xs text-[#4B5563]">{item.time}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#DFDFDF] bg-white p-6">
            <h2 className="inline-flex items-center gap-3 text-xl font-bold text-[#06402B]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F8F3E9] text-[#A88751]">
                <Shield className="h-5 w-5" />
              </span>
              Security Status
            </h2>

            <div className="mt-5 space-y-4">
              {securityStatus.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-md p-4 ${
                    item.tone === "success" ? "border border-[#BBF7D0] bg-[#ECFDF3]" : "bg-[#F4F1EA]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.tone === "success" ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#16A34A]" />
                    ) : (
                      <Lock className="mt-0.5 h-4 w-4 text-[#A88751]" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{item.title}</p>
                      <p className={`mt-1 text-xs ${item.tone === "success" ? "text-[#16A34A]" : "text-[#6B7280]"}`}>{item.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-5">
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-11 min-w-64 items-center justify-center gap-2 rounded-md bg-[#06402B] px-6 text-sm font-semibold text-white hover:bg-[#053020]"
        >
          <Save className="h-4 w-4" />
          Save Security Changes
        </button>
        <button
          type="button"
          onClick={onLogoutAllDevices}
          className="inline-flex h-11 min-w-56 items-center justify-center gap-2 rounded-md border border-[#A88751] bg-white px-6 text-sm font-semibold text-[#A88751] hover:bg-[#F8F3E9]"
        >
          <LogOut className="h-4 w-4" />
          Logout All Devices
        </button>
      </div>
    </div>
  );
}

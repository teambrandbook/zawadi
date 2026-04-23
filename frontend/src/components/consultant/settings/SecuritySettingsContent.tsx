import { Eye, Laptop, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { cn } from "@/utils/cn";
import type {
  LoginActivityItem,
  PasswordField,
  RecoveryField,
  SecurityPreference,
  TwoFactorMethod,
} from "./settingsTypes";

type Props = {
  passwordFields: PasswordField[];
  twoFactorEnabled: boolean;
  twoFactorMethods: TwoFactorMethod[];
  loginActivity: LoginActivityItem[];
  securityPreferences: SecurityPreference[];
  recoveryFields: RecoveryField[];
  onPasswordChange: (fieldId: string, value: string) => void;
  onToggleTwoFactor: () => void;
  onToggleTwoFactorMethod: (methodId: string) => void;
  onToggleSecurityPreference: (preferenceId: string) => void;
  onSave: () => void;
  onReset: () => void;
  onLogoutOtherDevices: () => void;
};

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <span className={cn("relative inline-flex h-6 w-11 rounded-full transition", enabled ? "bg-[#9F8151]" : "bg-[#E5E7EB]")}>
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition", enabled ? "left-[22px]" : "left-0.5")} />
    </span>
  );
}

function MethodIcon({ methodId }: { methodId: string }) {
  if (methodId === "email") return <Mail className="h-4 w-4 text-[#0A4833]" />;
  if (methodId === "sms") return <Smartphone className="h-4 w-4 text-[#0A4833]" />;
  return <ShieldCheck className="h-4 w-4 text-[#0A4833]" />;
}

function ActivityIcon({ device }: { device: string }) {
  if (device.toLowerCase().includes("iphone")) return <Smartphone className="h-5 w-5 text-[#0A4833]" />;
  return <Laptop className="h-5 w-5 text-[#0A4833]" />;
}

export default function SecuritySettingsContent({
  passwordFields,
  twoFactorEnabled,
  twoFactorMethods,
  loginActivity,
  securityPreferences,
  recoveryFields,
  onPasswordChange,
  onToggleTwoFactor,
  onToggleTwoFactorMethod,
  onToggleSecurityPreference,
  onSave,
  onReset,
  onLogoutOtherDevices,
}: Props) {
  return (
    <div className="space-y-5">
      <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Password &amp; Login Security</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {passwordFields.map((field, index) => (
                <label key={field.id} className={cn("text-xs font-medium text-[#0A4833]", index === 0 ? "md:col-span-1" : "md:col-span-1")}>
                  {field.label}
                  <div className="relative mt-2">
                    <input
                      type="password"
                      value={field.value}
                      onChange={(event) => onPasswordChange(field.id, event.target.value)}
                      placeholder={field.placeholder}
                      className="h-10 w-full rounded-[8px] border border-[#DFDFDF] bg-white px-3 pr-10 text-sm text-[#111827] outline-none"
                    />
                    <Eye className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A2B3]" />
                  </div>
                  {field.id === "new-password" ? (
                    <p className="mt-2 text-[11px] text-[#9CA3AF]">Password must be at least 8 characters with uppercase, lowercase, and numbers</p>
                  ) : null}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-[#DFDFDF] pt-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Two-Factor Authentication</h2>
            <p className="mt-2 text-sm text-[#6B7280]">Add an extra layer of protection to your account.</p>

            <div className="mt-5 rounded-[12px] bg-[#F7F4ED] px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A4833] text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#0A4833]">Enable Two-Factor Authentication</p>
                    <p className="mt-1 text-sm text-[#6B7280]">Protect your account with an extra verification step</p>
                  </div>
                </div>
                <button type="button" onClick={onToggleTwoFactor} aria-pressed={twoFactorEnabled} aria-label="Enable Two-Factor Authentication">
                  <Toggle enabled={twoFactorEnabled} />
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {twoFactorMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onToggleTwoFactorMethod(method.id)}
                  className={cn(
                    "rounded-[12px] border p-4 text-left transition",
                    method.enabled ? "border-[#9F8151] bg-[#FFFEFC]" : "border-[#DFDFDF] bg-white",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MethodIcon methodId={method.id} />
                    <p className="text-sm font-semibold text-[#0A4833]">{method.title}</p>
                  </div>
                  <p className="mt-2 text-xs text-[#6B7280]">{method.description}</p>
                  {method.recommended ? (
                    <span className="mt-3 inline-flex rounded-full bg-[#0A4833] px-2.5 py-1 text-[11px] font-medium text-white">Recommended</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#DFDFDF] pt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Login Activity</h2>
              <button
                type="button"
                onClick={onLogoutOtherDevices}
                className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#DFDFDF] px-4 text-xs font-medium text-[#9F8151] transition hover:bg-[#FAFAF8]"
              >
                Log Out Other Devices
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {loginActivity.map((item) => (
                <article key={item.id} className="flex items-center justify-between gap-4 rounded-[12px] border border-[#DFDFDF] px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EBE1CF]">
                      <ActivityIcon device={item.device} />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#0A4833]">{item.device}</p>
                      <p className="mt-1 text-sm text-[#6B7280]">{item.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#4B5563]">{item.time}</p>
                    {item.current ? (
                      <span className="mt-2 inline-flex rounded-full bg-[#0A4833] px-2.5 py-1 text-[11px] font-medium text-white">Current Session</span>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="border-t border-[#DFDFDF] pt-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Security Preferences</h2>
            <div className="mt-5 space-y-3">
              {securityPreferences.map((item) => (
                <article key={item.id} className="flex items-center justify-between gap-4 rounded-[12px] border border-[#DFDFDF] px-4 py-4">
                  <div>
                    <p className="text-[15px] font-semibold text-[#0A4833]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{item.description}</p>
                  </div>
                  <button type="button" onClick={() => onToggleSecurityPreference(item.id)} aria-pressed={item.enabled} aria-label={item.title}>
                    <Toggle enabled={item.enabled} />
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="border-t border-[#DFDFDF] pt-8">
            <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Recovery Options</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {recoveryFields.map((field) => (
                <div key={field.id}>
                  <p className="text-xs font-medium text-[#0A4833]">{field.label}</p>
                  <div className="mt-2 rounded-[12px] border border-[#DFDFDF] bg-white px-4 py-3 text-[15px] text-[#111827]">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-[50px] items-center justify-center rounded-[12px] bg-[#9F8151] px-6 text-sm font-medium text-white transition hover:bg-[#8C7247]"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-[50px] items-center justify-center rounded-[12px] border border-[#DFDFDF] bg-white px-6 text-sm font-medium text-[#0A4833] transition hover:bg-[#FAFAF8]"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}

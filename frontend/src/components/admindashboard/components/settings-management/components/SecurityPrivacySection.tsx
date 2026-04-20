import {
  BadgeCheck,
  Check,
  ChevronDown,
  FileEdit,
  KeyRound,
  Lock,
  Shield,
  ShieldCheck,
} from "lucide-react";
import type { SecurityPrivacySettings } from "../settingsTypes";

type SecurityPrivacySectionProps = {
  data: SecurityPrivacySettings;
  onChange: (next: SecurityPrivacySettings) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function SecurityPrivacySection({ data, onChange, onSave, onCancel }: SecurityPrivacySectionProps) {
  return (
    <div className="space-y-3">
      <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
        <div className="rounded-md border-l-4 border-[#9F8151] bg-[#9F81510D] p-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A4833]">
            <Shield size={13} className="text-[#9F8151]" />
            Security Configuration
          </p>
          <p className="mt-1 text-xs text-[#4B5563]">
            Configure authentication, access controls, and privacy policies to protect your community data.
            Changes will apply to all admin accounts.
          </p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
            <h3 className="inline-flex items-center gap-2 text-lg font-bold text-[#0A4833]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0A4833]/10">
                <Lock size={13} />
              </span>
              Authentication
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="border-b border-[#DFDFDF] pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0A4833]">Two-Factor Authentication</p>
                    <p className="text-[#4B5563]">Require 2FA for all admin accounts</p>
                  </div>
                  <button
                    onClick={() => onChange({ ...data, twoFactorEnabled: !data.twoFactorEnabled })}
                    className={`relative h-6 w-11 rounded-full transition ${
                      data.twoFactorEnabled ? "bg-[#0A4833]" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                        data.twoFactorEnabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="border-b border-[#DFDFDF] pb-3">
                <p className="text-sm font-semibold text-[#0A4833]">Password Policy</p>
                <p className="mb-2 text-[#4B5563]">Minimum Length</p>
                <button className="flex h-9 w-full items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3 text-sm text-[#0A4833]">
                  {data.passwordPolicy}
                  <ChevronDown size={13} className="text-[#0A4833]" />
                </button>
                <div className="mt-2 space-y-1 text-[#0A4833]">
                  <p className="inline-flex items-center gap-1.5">
                    <Check size={11} className="text-[#2563EB]" />
                    Require uppercase letters
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <Check size={11} className="text-[#2563EB]" />
                    Require numbers
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <Check size={11} className="text-[#2563EB]" />
                    Require special characters
                  </p>
                </div>
              </div>

              <div className="border-b border-[#DFDFDF] pb-3">
                <p className="text-sm font-semibold text-[#0A4833]">Session Timeout</p>
                <button className="mt-1 flex h-9 w-full items-center justify-between rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-3 text-sm text-[#0A4833]">
                  {data.sessionTimeout}
                  <ChevronDown size={13} className="text-[#0A4833]" />
                </button>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#0A4833]">Login Attempt Restriction</p>
                <div className="mt-1 inline-flex h-9 items-center rounded-md border border-[#DFDFDF] bg-[#EBE1CF4D] px-4 text-sm text-[#0A4833]">
                  {data.loginAttemptLimit}
                </div>
                <span className="ml-2 text-[#4B5563]">failed attempts before lockout</span>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
            <h3 className="inline-flex items-center gap-2 text-lg font-bold text-[#0A4833]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0A4833]/10">
                <ShieldCheck size={13} />
              </span>
              Privacy Controls
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="border-b border-[#DFDFDF] pb-3">
                <p className="text-sm font-semibold text-[#0A4833]">Data Visibility Rules</p>
                <div className="mt-2 space-y-1.5">
                  <button
                    onClick={() => onChange({ ...data, dataVisibility: "private" })}
                    className={`w-full rounded-md border px-3 py-2 text-left ${
                      data.dataVisibility === "private" ? "border-[#BFDBFE] bg-[#EFF6FF]" : "border-[#DFDFDF] bg-white"
                    }`}
                  >
                    <p className="text-sm text-[#0A4833]">Private by default</p>
                    <p className="text-[11px] text-[#4B5563]">Users control their data visibility</p>
                  </button>
                  <button
                    onClick={() => onChange({ ...data, dataVisibility: "community" })}
                    className={`w-full rounded-md border px-3 py-2 text-left ${
                      data.dataVisibility === "community"
                        ? "border-[#BFDBFE] bg-[#EFF6FF]"
                        : "border-[#DFDFDF] bg-white"
                    }`}
                  >
                    <p className="text-sm text-[#0A4833]">Community visible</p>
                    <p className="text-[11px] text-[#4B5563]">Data visible within community</p>
                  </button>
                  <button
                    onClick={() => onChange({ ...data, dataVisibility: "public" })}
                    className={`w-full rounded-md border px-3 py-2 text-left ${
                      data.dataVisibility === "public" ? "border-[#BFDBFE] bg-[#EFF6FF]" : "border-[#DFDFDF] bg-white"
                    }`}
                  >
                    <p className="text-sm text-[#0A4833]">Public profile</p>
                    <p className="text-[11px] text-[#4B5563]">Basic info publicly accessible</p>
                  </button>
                </div>
              </div>

              <div className="border-b border-[#DFDFDF] pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0A4833]">Consent Requirements</p>
                    <p className="text-[#4B5563]">Require explicit consent for data collection</p>
                  </div>
                  <button
                    onClick={() => onChange({ ...data, consentRequired: !data.consentRequired })}
                    className={`relative h-6 w-11 rounded-full transition ${
                      data.consentRequired ? "bg-[#0A4833]" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                        data.consentRequired ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#0A4833]">Sensitive Data Access</p>
                <button className="mt-1 flex h-9 w-full items-center justify-between rounded-md border border-[#DFDFDF] bg-white px-3 text-sm text-[#0A4833]">
                  {data.sensitiveDataAccess}
                  <ChevronDown size={13} className="text-[#0A4833]" />
                </button>
                <p className="mt-1 text-[11px] text-[#4B5563]">
                  Controls access to health data and personal information
                </p>
              </div>
            </div>
          </article>
        </div>
      </article>

      <div className="grid gap-3 lg:grid-cols-2">
        <article className="rounded-lg border border-[#DFDFDF] bg-gradient-to-br from-[#0A4833] to-[#0A4833E6] p-4 text-white">
          <div className="flex items-start justify-between">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
              <FileEdit size={14} />
            </span>
            <span className="text-[11px] font-semibold text-white/70">Active</span>
          </div>
          <h4 className="mt-3 text-xl font-bold">Privacy Policy</h4>
          <p className="mt-1 text-xs text-white/80">
            Manage your platform&apos;s privacy policy document and user consent agreements.
          </p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-white/70">Last updated</span>
            <span className="font-medium">March 15, 2024</span>
          </div>
          <button className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-semibold text-[#0A4833]">
            <FileEdit size={13} />
            Edit Policy Document
          </button>
        </article>

        <article className="rounded-lg border border-[#DFDFDF] bg-gradient-to-br from-[#9F8151] to-[#9F8151E6] p-4 text-white">
          <div className="flex items-start justify-between">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
              <KeyRound size={14} />
            </span>
            <span className="text-[11px] font-semibold text-white/80">Active</span>
          </div>
          <h4 className="mt-3 text-xl font-bold">{`Terms & Conditions`}</h4>
          <p className="mt-1 text-xs text-white/90">
            Define platform rules, user responsibilities, and legal agreements for community members.
          </p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-white/80">Last updated</span>
            <span className="font-medium">March 15, 2024</span>
          </div>
          <button className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-semibold text-[#9F8151]">
            <FileEdit size={13} />
            Edit Terms Document
          </button>
        </article>
      </div>

      <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-lg font-bold text-[#0A4833]">Review Your Changes</h4>
            <p className="text-xs text-[#4B5563]">
              Make sure all security settings are configured correctly before saving.
            </p>
          </div>
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={onCancel}
              className="inline-flex h-9 items-center justify-center rounded-md border-2 border-[#DFDFDF] px-4 text-sm font-semibold text-[#0A4833]"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#0A4833] px-5 text-sm font-semibold text-white"
            >
              <BadgeCheck size={13} />
              Save Changes
            </button>
          </div>
        </div>
      </article>

      <article className="rounded-lg border border-[#DFDFDF] bg-white p-4">
        <h4 className="inline-flex items-center gap-2 text-lg font-bold text-[#0A4833]">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#9F8151]/15 text-[#9F8151]">
            <Shield size={12} />
          </span>
          Recent Security Activity
        </h4>
        <div className="mt-3 space-y-2">
          <div className="flex items-start gap-2 rounded-md bg-[#EBE1CF4D] p-3">
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0A4833] text-white">
              <Check size={11} />
            </span>
            <div>
              <p className="text-sm font-medium text-[#0A4833]">Two-factor authentication enabled</p>
              <p className="text-[11px] text-[#4B5563]">By Admin User • 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-[#EBE1CF4D] p-3">
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#9F8151] text-white">
              <Shield size={11} />
            </span>
            <div>
              <p className="text-sm font-medium text-[#0A4833]">Password policy updated</p>
              <p className="text-[11px] text-[#4B5563]">By System Admin • 1 day ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-[#EBE1CF4D] p-3">
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0A4833] text-white">
              <FileEdit size={11} />
            </span>
            <div>
              <p className="text-sm font-medium text-[#0A4833]">Privacy policy revised</p>
              <p className="text-[11px] text-[#4B5563]">By Legal Team • 3 days ago</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

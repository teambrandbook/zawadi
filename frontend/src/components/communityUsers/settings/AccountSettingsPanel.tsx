import { Crown, Save } from "lucide-react";
import type { AccountDetail, LinkedAccount } from "./settingsTypes";

type Props = {
  accountDetails: AccountDetail[];
  linkedAccounts: LinkedAccount[];
  onToggleLinkedAccount: (accountId: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

function Facebook({ className = "" }: { className?: string }) {
  return <span className={`${className} text-lg font-bold leading-none`}>f</span>;
}

export default function AccountSettingsPanel({
  accountDetails,
  linkedAccounts,
  onToggleLinkedAccount,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#DFDFDF] bg-white p-4 sm:p-6">
        <h2 className="text-lg font-bold text-[#06402B]">Account Details</h2>
        <div className="mt-5 grid gap-3 sm:gap-5 md:grid-cols-2">
          {accountDetails.map((detail) => (
            <div key={detail.label} className="min-w-0 rounded-md bg-[#E9DFCC] p-4 sm:p-5">
              <p className="text-xs font-semibold text-[#6B7280]">{detail.label}</p>
              <p
                className={`mt-3 break-words text-sm font-semibold ${
                  detail.tone === "success" ? "text-[#16A34A]" : detail.tone === "premium" ? "text-[#A88751]" : "text-[#111827]"
                }`}
              >
                {detail.tone === "premium" && <Crown className="mr-1 inline h-4 w-4 align-[-2px]" />}
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#DFDFDF] bg-white p-4 sm:p-6">
        <h2 className="text-lg font-bold text-[#06402B]">Language &amp; Region</h2>
        <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
          <label className="block text-xs font-semibold text-[#374151]">
            Language
            <select className="mt-2 h-11 w-full rounded-md border border-[#DFDFDF] bg-[#F9FAFB] px-3 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]">
              <option>English (US)</option>
              <option>English (UK)</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-[#374151]">
            Timezone
            <select className="mt-2 h-11 w-full rounded-md border border-[#DFDFDF] bg-[#F9FAFB] px-3 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]">
              <option>Pacific Standard Time (PST)</option>
              <option>Eastern Standard Time (EST)</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-[#374151]">
            Region
            <select className="mt-2 h-11 w-full rounded-md border border-[#DFDFDF] bg-[#F9FAFB] px-3 text-sm font-normal text-[#111827] outline-none focus:border-[#06402B]">
              <option>United States</option>
              <option>India</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-[#DFDFDF] bg-white p-4 sm:p-6">
        <h2 className="text-lg font-bold text-[#06402B]">Linked Accounts</h2>
        <div className="mt-5 space-y-4">
          {linkedAccounts.map((account) => (
            <article key={account.id} className="flex flex-col gap-4 rounded-md border border-[#DFDFDF] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                    account.provider === "Google Account" ? "text-[#EF4444]" : "text-[#2563EB]"
                  }`}
                >
                  {account.provider === "Google Account" ? <span className="text-lg font-bold">G</span> : <Facebook />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111827]">{account.provider}</p>
                  <p className="mt-1 truncate text-xs text-[#6B7280]">{account.detail}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleLinkedAccount(account.id)}
                className={`h-9 w-full rounded-md border px-4 text-xs font-semibold ${
                  account.connected
                    ? "border-[#FCA5A5] text-[#EF4444] hover:bg-[#FEF2F2]"
                    : "border-[#06402B] text-[#06402B] hover:bg-[#E8F2ED]"
                } sm:w-auto`}
              >
                {account.connected ? "Disconnect" : "Connect"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#06402B] px-7 text-sm font-semibold text-white hover:bg-[#053020] sm:w-auto"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-11 w-full rounded-md border border-[#DFDFDF] bg-white px-7 text-sm font-semibold text-[#4B5563] hover:bg-[#F9FAFB] sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

import type { AccountInfoField, PasswordField } from "./settingsTypes";

type Props = {
  accountFields: AccountInfoField[];
  passwordFields: PasswordField[];
  onSave: () => void;
  onReset: () => void;
};

function FieldCard({ label, value, placeholder }: { label: string; value: string; placeholder?: string }) {
  return (
    <article>
      <p className="text-xs font-medium text-[#0A4833]">{label}</p>
      <div className="mt-2 h-[50px] rounded-[8px] border border-[#DFDFDF] bg-white px-4 py-3 text-[15px] text-[#111827]">
        {value || <span className="text-[#9CA3AF]">{placeholder ?? ""}</span>}
      </div>
    </article>
  );
}

export default function AccountSettingsContent({ accountFields, passwordFields, onSave, onReset }: Props) {
  return (
    <div className="space-y-5">
      <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-5 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] sm:p-6">
        <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">Account Information</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {accountFields.map((field) => (
            <FieldCard key={field.label} label={field.label} value={field.value} />
          ))}
        </div>

        <div className="mt-6 border-t border-[#DFDFDF] pt-6">
          <h3 className="text-lg font-medium tracking-[-0.5px] text-[#0A4833]">Change Password</h3>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {passwordFields.map((field) => (
              <FieldCard key={field.label} label={field.label} value={field.value} placeholder={field.placeholder} />
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-[50px] items-center justify-center rounded-[8px] bg-[#9F8151] px-6 text-sm font-medium text-white transition hover:bg-[#8C7247]"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-[50px] items-center justify-center rounded-[8px] border border-[#DFDFDF] bg-white px-6 text-sm font-medium text-[#0A4833] transition hover:bg-[#FAFAF8]"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}

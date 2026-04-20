import CreateUserSection from "./CreateUserSection";

type Permissions = {
  activate_immediately: boolean;
  send_welcome_email: boolean;
  send_password_setup: boolean;
  allow_notifications: boolean;
  is_verified_member: boolean; // ✅ FIXED
};

type Props = {
  values: Permissions;
  onToggle: (field: string, value: boolean) => void;
};

function Toggle({
  checked,
  onClick,
}: {
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-[#9F8151]" : "bg-[#DFDFDF]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
          checked ? "left-[22px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

function PermissionRow({
  title,
  desc,
  checked,
  onToggle,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#F7F7F7] p-4">
      <div>
        <p className="text-base font-medium text-[#0A4833]">{title}</p>
        <p className="text-sm text-[#4B5563]">{desc}</p>
      </div>
      <Toggle checked={checked} onClick={onToggle} />
    </div>
  );
}

export default function PermissionsSection({ values, onToggle }: Props) {
  return (
    <CreateUserSection title="Account Permissions">
      <div className="space-y-3">

        <PermissionRow
          title="Activate account immediately"
          desc="User can access platform right away"
          checked={values.activate_immediately}
          onToggle={() =>
            onToggle("activate_immediately", !values.activate_immediately)
          }
        />

        <PermissionRow
          title="Send welcome email"
          desc="Automated welcome message to user"
          checked={values.send_welcome_email}
          onToggle={() =>
            onToggle("send_welcome_email", !values.send_welcome_email)
          }
        />

        <PermissionRow
          title="Send password setup link"
          desc="Allow user to set their own password"
          checked={values.send_password_setup}
          onToggle={() =>
            onToggle("send_password_setup", !values.send_password_setup)
          }
        />

        <PermissionRow
          title="Allow platform notifications"
          desc="Enable push and email notifications"
          checked={values.allow_notifications}
          onToggle={() =>
            onToggle("allow_notifications", !values.allow_notifications)
          }
        />

        <PermissionRow
          title="Mark as verified member"
          desc="Show verification badge on profile"
          checked={values.is_verified_member} // ✅ FIXED
          onToggle={() =>
            onToggle("is_verified_member", !values.is_verified_member) // ✅ FIXED
          }
        />

      </div>
    </CreateUserSection>
  );
}
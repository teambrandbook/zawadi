import CreateUserSection from "./CreateUserSection";

type Props = {
  role: string;
  onRoleChange: (role: string) => void;
};

const roles = [
  { key: "admin", title: "Admin", desc: "Full access with consultations & events" },
  { key: "user", title: "User", desc: "community users" },
];

export default function RoleMembershipSection({ role, onRoleChange }: Props) {
  return (
    <CreateUserSection title="User Role & Membership">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {roles.map((item) => {
          const active = role === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onRoleChange(item.key)}
              className={`rounded-xl border p-4 text-left ${active ? "border-[#9F8151] bg-[#FCFAF6]" : "border-[#DFDFDF] bg-white"}`}
            >
              <p className="text-sm font-semibold text-[#0A4833]">{item.title}</p>
              <p className="text-xs text-[#6B7280]">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </CreateUserSection>
  );
}

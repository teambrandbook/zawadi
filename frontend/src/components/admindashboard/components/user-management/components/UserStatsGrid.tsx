import { Crown, ShieldAlert, UserCheck, UserMinus, UserPlus, Users } from "lucide-react";
import type { UserRecord } from "../userManagementShared";

type Props = { users: UserRecord[] };

export default function UserStatsGrid({ users }: Props) {
  const total = users.length;
  const active = users.filter((u) => u.isActive).length;
  const inactive = users.filter((u) => !u.isActive).length;
  const consultants = users.filter((u) => u.role.toLowerCase() === "consultant").length;
  const suspended = users.filter((u) => u.status === "Inactive" && !u.isActive).length;

  const cards = [
    { label: "Total Users",      value: String(total),       change: "",   hint: "",               Icon: Users,      iconBg: "bg-[#E7EFEA]", iconColor: "text-[#0A4833]", changeColor: "text-[#16A34A]" },
    { label: "Active Members",   value: String(active),      change: "",   hint: "active accounts", Icon: UserCheck,  iconBg: "bg-[#F2EEE7]", iconColor: "text-[#A88751]", changeColor: "text-[#16A34A]" },
    { label: "New This Week",    value: "—",                 change: "",   hint: "no data available",Icon: UserPlus,  iconBg: "bg-[#EAF1FF]", iconColor: "text-[#3B82F6]", changeColor: "text-[#16A34A]" },
    { label: "Inactive Users",   value: String(inactive),    change: "",   hint: "inactive accounts",Icon: UserMinus, iconBg: "bg-[#FFF6D9]", iconColor: "text-[#D4A500]", changeColor: "text-[#DC2626]" },
    { label: "Suspended",        value: String(suspended),   change: "",   hint: "inactive accounts",Icon: ShieldAlert,iconBg: "bg-[#FFEDEE]", iconColor: "text-[#EF4444]", changeColor: "text-[#EF4444]" },
    { label: "Consultants",      value: String(consultants), change: "",   hint: "consultant role",  Icon: Crown,     iconBg: "bg-[#F2EAFE]", iconColor: "text-[#A855F7]", changeColor: "text-[#16A34A]" },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map(({ label, value, hint, Icon, iconBg, iconColor, changeColor }) => (
        <article key={label} className="rounded-xl border border-[#DFDFDF] bg-white p-4">
          <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <p className="text-[38px] font-semibold leading-none text-[#0A4833]">{value}</p>
          <p className="mt-1 text-base text-[#4B5563]">{label}</p>
          {hint && <p className={`mt-1 text-sm ${changeColor}`}>{hint}</p>}
        </article>
      ))}
    </section>
  );
}

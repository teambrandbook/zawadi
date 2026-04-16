import { Crown, ShieldAlert, UserCheck, UserMinus, UserPlus, Users } from "lucide-react";

export type UserStatus = "Active" | "Inactive";

export type UserRecord = {
  id: string;
  fullName: string;
  userId: string;
  role: string;
  email: string;
  phone: string;
  photo: string | null;
  isActive: boolean;
  status: UserStatus;
  activity: string;
  lastLogin: string;
};

export const initialUsers: UserRecord[] = [];

export const summaryCards = [
  { label: "Total Users", value: "2,847", change: "+12%", hint: "vs last month", Icon: Users, iconBg: "bg-[#E7EFEA]", iconColor: "text-[#0A4833]", changeColor: "text-[#16A34A]" },
  { label: "Active Members", value: "2,341", change: "+8%", hint: "vs last month", Icon: UserCheck, iconBg: "bg-[#F2EEE7]", iconColor: "text-[#A88751]", changeColor: "text-[#16A34A]" },
  { label: "New This Week", value: "127", change: "+23%", hint: "vs last week", Icon: UserPlus, iconBg: "bg-[#EAF1FF]", iconColor: "text-[#3B82F6]", changeColor: "text-[#16A34A]" },
  { label: "Inactive Users", value: "506", change: "-3%", hint: "vs last month", Icon: UserMinus, iconBg: "bg-[#FFF6D9]", iconColor: "text-[#D4A500]", changeColor: "text-[#DC2626]" },
  { label: "Suspended", value: "23", change: "+2", hint: "this week", Icon: ShieldAlert, iconBg: "bg-[#FFEDEE]", iconColor: "text-[#EF4444]", changeColor: "text-[#EF4444]" },
  { label: "Premium Members", value: "892", change: "+18%", hint: "vs last month", Icon: Crown, iconBg: "bg-[#F2EAFE]", iconColor: "text-[#A855F7]", changeColor: "text-[#16A34A]" },
] as const;

export const PER_PAGE = 3;
export const STATUS_OPTIONS: Array<"All Status" | UserStatus> = ["All Status", "Active", "Inactive"];
export const ROLE_OPTIONS = ["All Role", "admin", "consultant", "user"] as const;
export const PERIOD_OPTIONS = ["Last 30 days", "Last 7 days", "Last 90 days"] as const;

export function toCsv(rows: UserRecord[]) {
  const header = ["Full Name", "User ID", "Email", "Phone", "Role", "Status", "Activity", "Last Login"];
  const values = rows.map((row) => [row.fullName, row.userId, row.email, row.phone, row.role, row.status, row.activity, row.lastLogin]);
  return [header, ...values]
    .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export function statusClass(status: UserStatus) {
  if (status === "Active") return "text-[#166534]";
  return "text-[#854D0E]";
}

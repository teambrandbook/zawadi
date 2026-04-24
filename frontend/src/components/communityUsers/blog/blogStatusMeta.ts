import { CheckCircle2, Clock, Edit3 } from "lucide-react";
import type { BlogStatus } from "./blogTypes";

export const blogStatusLabels: Record<BlogStatus, string> = {
  completed: "Published",
  continue_writing: "Draft",
  waiting_review: "Pending Review",
};

export const blogStatusClassNames: Record<BlogStatus, string> = {
  completed: "text-[#16A34A]",
  continue_writing: "text-[#A88751]",
  waiting_review: "text-[#2563EB]",
};

export const activityStatusMeta = {
  completed: { Icon: CheckCircle2, wrap: "bg-[#DDF7E8]", color: "text-[#16A34A]" },
  continue_writing: { Icon: Edit3, wrap: "bg-[#FEF3C7]", color: "text-[#A88751]" },
  waiting_review: { Icon: Clock, wrap: "bg-[#DBEAFE]", color: "text-[#2563EB]" },
} satisfies Record<BlogStatus, { Icon: typeof CheckCircle2; wrap: string; color: string }>;

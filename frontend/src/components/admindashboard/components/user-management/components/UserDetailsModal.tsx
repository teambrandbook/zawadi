"use client";

import { X } from "lucide-react";
import type { UserRecord } from "../userManagementShared";

type Props = {
  user: UserRecord | null;
  onClose: () => void;
};

type DetailRowProps = {
  label: string;
  value: string | number;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-3 border-b border-[#E5E7EB] py-3 text-sm">
      <p className="font-semibold text-[#374151]">{label}</p>
      <p className="text-[#4B5563]">{value}</p>
    </div>
  );
}

export default function UserDetailsModal({ user, onClose }: Props) {
  if (!user) return null;

  const normalizedRole = user.role.toLowerCase();
  const isCommunityUser =
    (normalizedRole === "community_user" || normalizedRole === "user") && user.communityuser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[#0A4833]">User Details</h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              {user.fullName} ({user.role})
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-[#6B7280] hover:text-[#111827]" aria-label="Close details">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl border border-[#DFDFDF] bg-[#FAFAFA] p-4">
            <h3 className="mb-3 text-base font-semibold text-[#111827]">Basic Information</h3>
            <DetailRow label="Full Name" value={user.fullName} />
            <DetailRow label="User ID" value={user.userId} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Phone" value={user.phone} />
            <DetailRow label="Role" value={user.role} />
            <DetailRow label="Status" value={user.status} />
          </div>

          {isCommunityUser && (
            <div className="mt-5 rounded-xl border border-[#DFDFDF] bg-white p-4">
              <h3 className="mb-3 text-base font-semibold text-[#111827]">Community User Information</h3>
              <DetailRow label="User Type" value={user.communityuser.user_type} />
              <DetailRow label="Wellness Interests" value={user.communityuser.wellness_interests} />
              <DetailRow label="Diet Preference" value={user.communityuser.diet_preference} />
              <DetailRow label="Preferred Communication" value={user.communityuser.preferred_communication} />
            </div>
          )}

          {!isCommunityUser && (
            <div className="mt-5 rounded-xl border border-[#DFDFDF] bg-white p-4 text-sm text-[#6B7280]">
              No additional role-specific information is available for this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

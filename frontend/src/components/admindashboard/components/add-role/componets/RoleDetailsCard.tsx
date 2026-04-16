"use client";

type Member = {
  id: number;
  src: string;
};

type Role = {
  id: number;
  role_name: string;
  access_level: string;
  role_status: string;
  member_count: number;
  updated_at: string;
  members?: Member[]; // optional because API may not send it
};

type Props = {
  role: Role;
};

export default function RoleDetailsCard({ role }: Props) {
  const formattedDate = role.updated_at
    ? new Date(role.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const members = Array.isArray(role.members) ? role.members : [];

  return (
    <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-bold text-[#064e3b]">Role Details</h2>

      <p className="mb-1 text-lg font-semibold text-gray-800">{role.role_name}</p>

      <div className="mb-6 flex gap-3">
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {role.access_level}
        </span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {role.role_status}
        </span>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-gray-400">Assigned Admins</p>

        <div className="flex items-center">
          <div className="mr-3 flex -space-x-2">
            {members.length > 0 ? (
              members.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white"
                >
                  <img
                    src={member.src}
                    alt="Admin avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No admins assigned</p>
            )}
          </div>

          <span className="text-sm text-gray-400">
            {role.member_count ?? members.length} admins
          </span>
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-gray-400">Last Updated</p>
        <p className="text-[15px] font-medium text-gray-800">{formattedDate}</p>
      </div>

      <button className="w-full rounded-xl bg-[#064e3b] py-3 font-semibold text-white transition-colors hover:bg-[#053e2f]">
        Edit Role
      </button>
    </div>
  );
}
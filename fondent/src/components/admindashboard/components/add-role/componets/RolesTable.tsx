"use client";

type Role = {
  id: number;
  role_name: string;
  description: string;
  access_level: string;
  role_status: string;
  member_count: number;
  updated_at: string;
  members: { id: number; src: string }[];
};

type Props = {
  roles: Role[];
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
};

export default function RolesTable({
  roles,
  selectedRole,
  onSelectRole,
}: Props) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#064e3b]">Admin Roles</h2>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-gray-200">
            <th className="px-6 py-4 text-sm font-medium text-gray-500 w-[40%] text-left">
              Role
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500 text-center">
              Assigned
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500 text-center">
              Access Level
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500 text-right">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {roles.map((role) => (
            <tr
              key={role.id}
              onClick={() => onSelectRole(role)}
              className="cursor-pointer transition-colors hover:bg-gray-50"
            >
              {/* Role */}
              <td className="px-6 py-5 text-left">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {role.role_name}
                  </span>
                  <span className="text-sm text-gray-400">
                    {role.description}
                  </span>
                </div>
              </td>

              {/* Assigned */}
              <td className="px-6 py-5 text-center text-gray-600">
                {role.member_count}
              </td>

              {/* Access Level */}
              <td className="px-6 py-5 text-center text-gray-600 font-medium">
                {role.access_level}
              </td>

              {/* Status */}
              <td className="px-6 py-5 text-right font-semibold text-green-600 text-sm">
                {role.role_status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
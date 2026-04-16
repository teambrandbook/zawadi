// This is one permission object shape
type Permission = {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_approve: boolean;
  can_export: boolean;
  full_access: boolean;
};

type Props = {
  permissions: Permission[];
  onChange: (module: string, field: string, value: boolean) => void;
};

// ✅ Single checkbox cell
function Cell({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <td className="px-3 py-3 text-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)} // ✅ send true/false
        className="h-4 w-4 accent-[#0B73F6]"
      />
    </td>
  );
}

// ✅ Single module row
function ModuleRow({
  permission,
  onChange,
}: {
  permission: Permission;
  onChange: (module: string, field: string, value: boolean) => void;
}) {
  return (
    <tr className="border-t border-[#E6E6E6]">
      <td className="px-3 py-3 text-sm text-[#06402B]">{permission.module}</td>
      <Cell checked={permission.can_view}    onChange={(val) => onChange(permission.module, "can_view", val)} />
      <Cell checked={permission.can_create}  onChange={(val) => onChange(permission.module, "can_create", val)} />
      <Cell checked={permission.can_edit}    onChange={(val) => onChange(permission.module, "can_edit", val)} />
      <Cell checked={permission.can_delete}  onChange={(val) => onChange(permission.module, "can_delete", val)} />
      <Cell checked={permission.can_approve} onChange={(val) => onChange(permission.module, "can_approve", val)} />
      <Cell checked={permission.can_export}  onChange={(val) => onChange(permission.module, "can_export", val)} />
      <Cell checked={permission.full_access} onChange={(val) => onChange(permission.module, "full_access", val)} />
    </tr>
  );
}

export default function PermissionsMatrixCard({ permissions, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-[#D9D9D9] bg-white px-6 py-6">
      <h2 className="text-3xl font-bold text-[#06402B]">Permissions Matrix</h2>
      <p className="mt-2 text-base text-[#5C8A79]">Configure granular access control for each module.</p>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[#D9D9D9]">
              <th className="px-3 py-3 text-left text-xs font-semibold text-[#06402B]">Module</th>
              <th className="px-3 py-3 text-xs font-semibold text-[#06402B]">View</th>
              <th className="px-3 py-3 text-xs font-semibold text-[#06402B]">Create</th>
              <th className="px-3 py-3 text-xs font-semibold text-[#06402B]">Edit</th>
              <th className="px-3 py-3 text-xs font-semibold text-[#06402B]">Delete</th>
              <th className="px-3 py-3 text-xs font-semibold text-[#06402B]">Approve</th>
              <th className="px-3 py-3 text-xs font-semibold text-[#06402B]">Export</th>
              <th className="px-3 py-3 text-xs font-semibold text-[#A38653]">Full</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <ModuleRow
                key={permission.module}
                permission={permission}
                onChange={onChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
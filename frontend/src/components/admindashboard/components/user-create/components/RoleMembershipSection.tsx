import CreateUserSection from "./CreateUserSection";

type Role = {
  access_level: string;
  role_name: string;
  id: number;
};

type Props = {
  role: string;
  role_obj: number | null;
  roles: Role[];
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

const staticRoles = [
  {
    key: "admin",
    title: "Admin",
    desc: "Full access with consultations & events",
    roleKey: "ADMIN",
  },
  {
    key: "user",
    title: "User",
    desc: "Community users",
    roleKey: "COMMUNITY_USER",
  },
];

export default function RoleMembershipSection({
  role,
  role_obj,
  roles,
  setForm,
}: Props) {

  // 🔹 Merge static + dynamic roles
  const allRoles = [
    ...staticRoles.map((item) => ({
      type: "static",
      id: null,
      roleKey: item.roleKey,
      title: item.title,
      desc: item.desc,
    })),
    ...roles.map((item) => ({
      type: "dynamic",
      id: item.id,
      roleKey: item.role_name,
      title: item.role_name,
      desc: item.access_level,
    })),
  ];

  // 🔹 Single handler
  const handleSelect = (item: any) => {
    if (item.type === "static") {
      setForm((prev: any) => ({
        ...prev,
        role: item.roleKey,
        role_obj: null,
      }));
    } else {
      setForm((prev: any) => ({
        ...prev,
        role: "INTERNAL_STAFF",
        role_obj: item.id,
      }));
    }
  };
 console.log(role,role_obj);
 
  return (
    <CreateUserSection title="User Role & Membership">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

        {allRoles.map((item, index) => {
          const isSelected =
            item.type === "static"
              ? role === item.roleKey && role_obj === null
              : role_obj === item.id;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className={`w-full text-left p-3 border rounded transition
                ${
                  isSelected
                    ? "bg-green-100 border-green-500"
                    : "border-gray-300"
                }
              `}
            >
              <p className="text-sm font-semibold text-[#0A4833]">
                {item.title}
              </p>
              <p className="text-xs text-[#6B7280]">
                {item.desc}
              </p>
            </button>
          );
        })}

      </div>
    </CreateUserSection>
  );
}
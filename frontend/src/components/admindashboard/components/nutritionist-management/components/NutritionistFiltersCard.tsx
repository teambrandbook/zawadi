import { ChevronDown, MessageCircle, Mic, Search, Video } from "lucide-react";

const sessionTypes = [
  { id: "video", label: "Video", icon: "video" as const },
  { id: "audio", label: "Audio", icon: "audio" as const },
  { id: "chat", label: "Chat", icon: "chat" as const },
];

function sessionIcon(icon: "video" | "audio" | "chat") {
  if (icon === "video") return Video;
  if (icon === "audio") return Mic;
  return MessageCircle;
}

export default function NutritionistFiltersCard() {
  return (
    <section className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-4">
        <div>
          <p className="mb-1 text-xs text-[#5E7E72]">Search Expert</p>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8CA39A]" />
            <input
              type="text"
              placeholder="Name, specialization, email..."
              className="h-10 w-full rounded-md border border-[#D9D9D9] bg-[#F2EFE8] pl-9 pr-3 text-sm text-[#0A4833] outline-none placeholder:text-[#8CA39A]"
            />
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs text-[#5E7E72]">Status</p>
          <button className="flex h-10 w-full items-center justify-between rounded-md border border-[#D9D9D9] bg-[#F2EFE8] px-3 text-sm text-[#0A4833]">
            All Status
            <ChevronDown size={15} />
          </button>
        </div>

        <div>
          <p className="mb-1 text-xs text-[#5E7E72]">Expertise</p>
          <button className="flex h-10 w-full items-center justify-between rounded-md border border-[#D9D9D9] bg-[#F2EFE8] px-3 text-sm text-[#0A4833]">
            All Specializations
            <ChevronDown size={15} />
          </button>
        </div>

        <div>
          <p className="mb-1 text-xs text-[#5E7E72]">Sort By</p>
          <button className="flex h-10 w-full items-center justify-between rounded-md border border-[#D9D9D9] bg-[#F2EFE8] px-3 text-sm text-[#0A4833]">
            Newest Added
            <ChevronDown size={15} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-xs text-[#5E7E72]">Session Type:</p>
        {sessionTypes.map((item) => {
          const Icon = sessionIcon(item.icon);
          return (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 rounded-md bg-[#E9EDEE] px-2.5 py-1 text-xs font-medium text-[#6E837C]"
            >
              <Icon size={12} />
              {item.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}

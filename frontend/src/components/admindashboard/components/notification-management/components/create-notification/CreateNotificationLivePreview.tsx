type Props = {
  title?: string;
  body?: string;
  channels?: string[];
};

function channelLabel(channel: string) {
  if (channel === "email") return "Email";
  if (channel === "in_app") return "In-App";
  if (channel === "push") return "Push";
  return channel;
}

export default function CreateNotificationLivePreview({ title, body, channels = ["in_app"] }: Props) {
  const displayTitle = title?.trim() || "Notification Title";
  const displayBody = body?.trim() || "Your notification message will appear here...";

  return (
    <aside className="rounded-xl border border-[#DFDFDF] bg-white p-4">
      <h2 className="text-sm font-semibold text-[#0A4833]">Live Preview</h2>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {channels.map((channel) => (
          <span key={channel} className="rounded-md bg-[#0A4833] px-2.5 py-1 text-[10px] font-medium text-white">
            {channelLabel(channel)}
          </span>
        ))}
      </div>

      {/* In-App Preview */}
      {channels.includes("in_app") ? <div className="mt-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase text-[#9CA3AF]">In-App</p>
        <div className="rounded-md border border-[#E4E7EC] bg-white p-3 shadow-sm">
          <p className="text-[12px] font-semibold text-[#0A4833]">{displayTitle}</p>
          <p className="mt-1 line-clamp-3 text-[11px] text-[#6B7280]">{displayBody}</p>
          <p className="mt-2 text-[10px] text-[#A1844F]">Just now</p>
        </div>
      </div> : null}

      {/* Email Preview */}
      {channels.includes("email") ? <div className="mt-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase text-[#9CA3AF]">Email</p>
        <div className="rounded-md border border-[#E4E7EC] bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#E4E7EC] pb-2">
            <div className="h-7 w-7 rounded-full bg-[#0A4833] grid place-items-center">
              <span className="text-[10px] font-bold text-white">Z</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#111827]">ZEWADI Platform</p>
              <p className="text-[10px] text-[#9CA3AF]">notifications@zewadi.com</p>
            </div>
          </div>
          <p className="mt-2 text-[12px] font-semibold text-[#0A4833]">{displayTitle}</p>
          <p className="mt-1 text-[11px] text-[#6B7280] line-clamp-4">{displayBody}</p>
        </div>
      </div> : null}

      {channels.includes("push") ? <div className="mt-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase text-[#9CA3AF]">Browser Push</p>
        <div className="rounded-md border border-[#E4E7EC] bg-white p-3 shadow-sm">
          <p className="text-[12px] font-semibold text-[#0A4833]">{displayTitle}</p>
          <p className="mt-1 line-clamp-3 text-[11px] text-[#6B7280]">{displayBody}</p>
        </div>
      </div> : null}
    </aside>
  );
}

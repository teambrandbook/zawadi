import Link from "next/link";

export default function CreateNotificationActions() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DFDFDF] bg-white p-4">
      <Link href="/admindashboard/notifications" className="inline-flex h-9 items-center rounded-md bg-[#0A4833] px-4 text-xs text-white">
        Create Notification
      </Link>
      <Link href="/admindashboard/notifications" className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563]">
        Save as Draft
      </Link>
      <Link href="/admindashboard/notifications/create" className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563]">
        Preview
      </Link>
      <Link href="/admindashboard/notifications/create" className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563]">
        Send Test
      </Link>
    </div>
  );
}


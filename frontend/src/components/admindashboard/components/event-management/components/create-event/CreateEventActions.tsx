import Link from "next/link";

export default function CreateEventActions() {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Link href="/admindashboard/events" className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563]">
        Cancel
      </Link>
      <Link href="/admindashboard/events" className="inline-flex h-9 items-center rounded-md border border-[#DFDFDF] px-4 text-xs text-[#4B5563]">
        Save as Draft
      </Link>
      <Link href="/admindashboard/events/create" className="inline-flex h-9 items-center rounded-md bg-[#9F8151] px-4 text-xs text-white">
        Preview Event
      </Link>
      <Link href="/admindashboard/events" className="inline-flex h-9 items-center rounded-md bg-[#0A4833] px-4 text-xs text-white">
        Create Event
      </Link>
    </div>
  );
}


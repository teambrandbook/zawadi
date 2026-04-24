"use client";

type Props = {
  onMarkAllAsRead: () => void;
};

export default function NotificationHeader({ onMarkAllAsRead }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-[30px] font-bold tracking-[-0.03em] text-[#0A4833]">Notifications</h1>
        <p className="mt-1 text-sm text-[#A88751]">
          Stay updated with your consultation activities and client communications
        </p>
      </div>

      <button
        type="button"
        onClick={onMarkAllAsRead}
        className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#0A4833] px-5 text-sm font-medium text-white transition hover:bg-[#083B2A]"
      >
        Mark All as Read
      </button>
    </div>
  );
}


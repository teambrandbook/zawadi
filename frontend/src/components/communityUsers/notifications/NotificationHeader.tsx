type Props = {
  title: string;
  subtitle: string;
};

export default function NotificationHeader({ title, subtitle }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-[#0A4833]">{title}</h1>
        <p className="mt-1 max-w-[720px] text-sm text-[#4B5563]">{subtitle}</p>
      </div>

      <div className="relative w-full max-w-[320px]">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9CA3AF]">
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path
              d="M14.1667 14.1667L17.5 17.5M16.6667 9.16667C16.6667 13.3088 13.3088 16.6667 9.16667 16.6667C5.02453 16.6667 1.66667 13.3088 1.66667 9.16667C1.66667 5.02453 5.02453 1.66667 9.16667 1.66667C13.3088 1.66667 16.6667 5.02453 16.6667 9.16667Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          type="text"
          readOnly
          placeholder="Search notifications..."
          className="h-11 w-full rounded-lg border border-[#DFDFDF] bg-[#F7F3EC] pl-10 pr-4 text-sm text-[#4B5563] placeholder:text-[#9CA3AF] focus:outline-none"
        />
      </div>
    </div>
  );
}

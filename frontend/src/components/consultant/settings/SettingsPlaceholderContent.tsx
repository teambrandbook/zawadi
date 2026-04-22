type Props = {
  title: string;
  description: string;
};

export default function SettingsPlaceholderContent({ title, description }: Props) {
  return (
    <section className="rounded-[12px] border border-[#DFDFDF] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
      <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#0A4833]">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">{description}</p>
    </section>
  );
}

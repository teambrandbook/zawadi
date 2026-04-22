type Props = {
  title: string;
};

export default function SettingsPlaceholderPanel({ title }: Props) {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-8">
      <h2 className="text-xl font-bold text-[#06402B]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#6B7280]">This section is ready for the next design.</p>
    </section>
  );
}

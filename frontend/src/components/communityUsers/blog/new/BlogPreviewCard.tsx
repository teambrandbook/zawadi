export default function BlogPreviewCard() {
  return (
    <section className="rounded-lg border border-[#DFDFDF] bg-white p-5">
      <h2 className="text-lg font-bold text-[#06402B]">Preview</h2>
      <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
        <div className="h-28 rounded-md bg-[#E5E7EB]" />
        <h3 className="mt-4 text-base font-bold text-[#06402B]">Blog Title Preview</h3>
        <p className="mt-2 text-sm text-[#6B7280]">Short excerpt will appear here...</p>
      </div>
    </section>
  );
}
